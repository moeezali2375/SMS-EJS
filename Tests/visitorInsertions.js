const Visitor = require("../models/visitor");

module.exports.insert = async () => {
	Visitor.insertMany([
		{
			residentId: "653416071022a0d29081b026",
			name: "Affan Zahir",
			cnic: "1234567890123",
			reason: "Mujhe pick krnay a rha hai wo",
			date: new Date(),
		},
		{
			residentId: "653416071022a0d29081b026",
			name: "Muhammad Saad",
			cnic: "1234567890123",
			reason: "Phpiyun walay kaam krnay ana hai us ne",
			date: new Date(),
		},
		{
			residentId: "6534162c1022a0d29081b035",
			name: "Maham Javed",
			cnic: "1234567890123",
			reason: "Us ne sona hai",
			date: new Date(),
		},
		{
			residentId: "6534162c1022a0d29081b035",
			name: "Aiza Tahir",
			cnic: "1234567890123",
			reason: "Shadi per jana  us ne",
			date: new Date(),
		},
	]);
};
