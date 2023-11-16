const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	salt: {
		type: String,
		required: true,
	},
	hash: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model("users", userSchema);

module.exports = User;
