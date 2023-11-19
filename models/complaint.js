const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
	residentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "residents",
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	isSolved: {
		type: Boolean,
		default: false,
	},
});

const Complaint = mongoose.model("complaints", complaintSchema);

module.exports = Complaint;
