const Bill = require("../../models/bill");
const Payment = require("../../models/payment");

module.exports.home = (req, res) => {
	res.render("resident/home");
};

module.exports.get_bills_paid = async (req, res) => {
	try {
		const bills = await Bill.find({ residentId: req.user._id, isPayed: true });
		res.render("resident/paidBills", { bills: bills });
	} catch (error) {
		console.log(error);
	}
};

module.exports.get_bills_unpaid = async (req, res) => {
	try {
		const message = req.session.message;
		req.session.message = null;
		const bills = await Bill.find({ residentId: req.user._id, isPayed: false });
		res.render("resident/unpaidBills", { bills: bills, message: message });
	} catch (error) {
		console.log(error);
	}
};

module.exports.bill_detail_page = async (req, res) => {
	try {
		const bill = await Bill.findOne(req.params.id);
		const payment = await Payment.findOne(bill._id);
		res.render("resident/billDetail", { bill: bill, payment: payment });
	} catch (error) {
		console.log(error);
	}
};

module.exports.pay_bill = async (req, res) => {
	let message;
	try {
		const { billId, bank, tid } = req.body;
		await Payment.insertMany({
			billId: billId,
			bank: bank,
			tid: tid,
			date: new Date(),
		});
		message = "Payment information uploaded successfully!";
	} catch (error) {
		console.log(error);
		message = "Error uploading payment information!";
	}
	res.redirect("/resident/bills/unpaid");
};
