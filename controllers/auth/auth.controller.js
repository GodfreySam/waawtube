const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const verifyEmail = require("../../utils/verifyEmail");
const randomstring = require("randomstring");

//Local Strategy with Passport
passport.use(
	new LocalStrategy(
		{
			usernameField: "value",
			passReqToCallback: true,
		},
		async (req, value, password, done) => {
			await User.findOne({ $or: [{ username: value }, { email: value }] }).then(
				async (user) => {
					if (!user)
						return done(null, false, req.flash("error-message", "user not found"));
					await bcrypt.compare(password, user.password, (err, passwordMatch) => {
						if (err) return done(err);

						if (!passwordMatch)
							return done(null, false, req.flash("error-message", "Invalid Password"));

						return done(
							null,
							user,
							req.flash("success-message", "Login successfull"),
						);
					});
				},
			);
		},
	),
);

// Needed for login
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = {
	register: async (req, res) => {
		res.render("auth/register", { pageTitle: "Register" });
	},

	login: async (req, res) => {
		res.render("auth/login", { pageTitle: "Login" });
	},

	postRegister: async (req, res) => {
		try {
			let { username, email, password, confirmPassword } = req.body;

			if (password.length < 6) {
				req.flash("error-message", "Password should be 6 or characters");
				return res.redirect("back");
			}

			if (password !== confirmPassword) {
				req.flash("error-message", "Passwords do not match");
				return res.redirect("back");
			}

			let userExists = await User.findOne({ email: email });
			let nameExists = await User.findOne({ username: username });

			if (userExists) {
				req.flash("error-message", "Email already exist!!");
				return res.redirect("back");
			}

			if (nameExists) {
				req.flash("error-message", "Username already exist!!");
				return res.redirect("back");
			}

			//Hash Password
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(password, salt);

			const secretToken = randomstring.generate();

			let newUser = new User({
				username: username,
				secretToken: secretToken,
				email: email,
				password: hashedPassword,
			});
			// Send Email with Nodemailer
			await verifyEmail(req, username, email, secretToken);

			if (!newUser) {
				req.flash("error-message", "Something Went Wrong, Please try again");
				return res.redirect("back");
			}

			req.flash(
				"success-message",
				"Account Created Successfully!!, Please check your email to verify your account",
			);
			return res.redirect("/auth/login");
		} catch (err) {
			console.log(err);
		}
	},

	postLogin: passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/auth/login",
		failureFlash: true,
		successFlash: true,
		session: true,
	}),

	forgotPassword: async (req, res) => {},
};
