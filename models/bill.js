const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
	residentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "residents",
		required: true,
	},
	isPayed: {
		type: Boolean,
		default: false,
	},
	billType: {
		type: Number,
		min: 0,
		max: 2,
		required: true,
	},
	oldUnits: {
		type: Number,
		required: true,
	},
	currentUnits: {
		type: Number,
		required: true,
		validate: {
			validator: function (value) {
				return value > this.oldUnits;
			},
			message: "New units must be greater than old units.",
		},
	},
	dueDate: {
		type: Date,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
});

const Bill = mongoose.model("bills", billSchema);

module.exports = Bill;
