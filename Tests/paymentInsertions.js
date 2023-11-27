const Payment = require("../models/payment");

module.exports.insert = async () => {
	await Payment.insertMany([
		{
			billId: "653437a087ccc0c6aa6169f6",
			bank: "Askari",
			tid: "123456789",
			date: new Date(),
		},
		{
			billId: "65586208701dab9abfce3977",
			bank: "Meezan",
			tid: "1234567891",
			date: new Date(),
		},
	]);
};
