const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		username: {
			type: String,
		},
		email: {
			type: String,
		},
		secretToken: {
			type: String,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
		},
		videos: [
			{
				type: mongoose.Types.ObjectId,
				ref: "video",
			},
		],
	},
	{ timestamps: true },
);

const User = mongoose.model("user", userSchema);

module.exports = User;
