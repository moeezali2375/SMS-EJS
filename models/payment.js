const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
	billId: {
		type: mongoose.Schema.ObjectId,
		ref: "bills",
		unique: true,
		required: true,
	},
	bank: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	tid: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
});

const Payment = new mongoose.model("payments", paymentSchema);

module.exports = Payment;
