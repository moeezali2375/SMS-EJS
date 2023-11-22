const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
	residentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "residents",
        required:true,
	},
	name: {
		type: String,
		required: true,
	},
	cnic: {
		type: Number,
		min: 1000000000000,
		max: 9999999999999,
		required: true,
	},
	reason: {
		type: String,
        required:true,
	},
    date:{
        type:Date,
        required:true,
    },
	isVerified: {
		type: Boolean,
		default: false,
	},
});

const Visitor = mongoose.model("visitors", visitorSchema);

module.exports = Visitor;
