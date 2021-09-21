const User = require("../../models/User.model");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const randomstring = require('randomstring');
const verifyEmail = require('../../utils/verifyEmail');

module.exports = {
	register: async (req, res) => {
		let pageTitle = "Register page";
		res.render("auth/register", { pageTitle });
	},

	login: async (req, res) => {
		let pageTitle = "Login page";
		res.render("auth/login", { pageTitle });
	},

	postRegister: async (req, res) => {
		try {
			let { username, email, password, confirmPassword } = req.body;

			console.log(req.body);

			if (password !== confirmPassword) {
				req.flash("error-message", "Passwords do not match");
				return res.redirect("back");
			}

			let userExists = await User.findOne({ username });
			let emailExists = await User.findOne({ email });

			if (userExists) {
				req.flash("error-message", "Username aleady exist!");
				return res.redirect("back");
			}

			if (emailExists) {
				req.flash("error-message", "Email aleady exist!");
				return res.redirect("back");
			}

			if (password.length < 6) {
				req.flash("error-message", "Password must be six characters or more");
				return res.redirect("back");
			}

			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(password, salt);
         const secretToken = randomstring.generate();

			const newUser = new User({
				username,
            email,
            secretToken,
				password: hashedPassword,
         });
         
         await newUser.save();

         await verifyEmail(req, username, email, secretToken);

			if (!newUser) {
				req.flash("error-message", "An error occurred while registering user");
				return res.redirect("back");
			}

			req.flash(
				"success-message",
				"User registration successful, Check your email to verify your account",
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

	forgotPassword: async (req, res) => {
		let pageTitle = "Password reset";
		res.render("auth/forgot-password", { pageTitle });
	},

	postForgotPassword: async (req, res) => {},
};
