const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		unique: true,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	cnic: {
		type: Number,
		min: 1000000000000,
		max: 9999999999999,
		required: true,
		unique: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
});

const Resident = mongoose.model("residents", residentSchema);

module.exports = Resident;
