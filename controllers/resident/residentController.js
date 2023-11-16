const Bill = require("../../models/bill");
const Payment = require("../../models/payment");
const Image = require("../../models/image");
const upload = require("../../middlewares/multer");

const { default: mongoose } = require("mongoose");

module.exports.home = (req, res) => {
	res.send("Home page of Resident!");
};

module.exports.get_bills = async (req, res) => {
	try {
		const query = {};
		if (req.query.isPayed) query.isPayed = req.query.isPayed;
		query.residentId = req.user._id;
		const bills = await Bill.find(query);
		res.status(200).json(bills);
	} catch (error) {
		res.status(400).send(error.message);
	}
};

// module.exports.payment_details = async (req, res) => {
// 	upload(req, res, (err) => {
// 		if (err) {
// 			res.status(400).send(err.message);
// 		} else {
// 			const newImage = new Image({
// 				name: req.body.name,
// 				image: {
// 					data: req.file.filename,
// 					contentType: "image/png",
// 				},
// 			});
// 			newImage
// 				.save()
// 				.then(() => {
// 					res.status(200).send("Picture Uploaded Successfully!");
// 				})
// 				.catch((err) => {
// 					res.status(400).send(err.message);
// 				});
// 		}
// 	});
// };

module.exports.pay_bill = async (req, res) => {
	try {
		const { billId, bank, amount, tid } = req.body;
		await Payment.insertMany({
			billId: billId,
			bank: bank,
			amount: amount,
			tid: tid,
			date: new Date(),
		});
		res.status(201).send("Payment Details Added Successfully!");
	} catch (error) {
		res.status(400).send(error.message);
	}
};
