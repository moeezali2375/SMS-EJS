const Bill = require("../../models/bill");
const Payment = require("../../models/payment");
const Visitor = require("../../models/visitor");

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
		const bill = await Bill.findById(req.params.id);
		const payment = await Payment.findOne({ billId: bill._id });
		res.render("resident/billDetail", { bill: bill, payment: payment });
	} catch (error) {
		console.log(error);
	}
};

module.exports.pay_bill = async (req, res) => {
	try {
		const { billId, bank, tid } = req.body;
		await Payment.insertMany({
			billId: billId,
			bank: bank,
			tid: tid,
			date: new Date(),
		});
		req.session.message = "Payment information uploaded successfully!";
	} catch (error) {
		console.log(error);
		req.session.message = "Error uploading payment information!";
	}
	res.redirect("/resident/bills/unpaid");
};

module.exports.verified_visitors = async (req, res) => {
	try {
		const visitors = await Visitor.find({
			residentId: req.user._id,
			isVerified: true,
		});
		res.render("resident/verifiedVisitors", { visitors: visitors });
	} catch (error) {
		console.log(error);
	}
};

module.exports.unverified_visitors = async (req, res) => {
	try {
		const message = req.session.message;
		req.session.message = null;
		const visitors = await Visitor.find({
			residentId: req.user._id,
			isVerified: false,
		});
		res.render("resident/unverifiedVisitors", {
			visitors: visitors,
			message: message,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.visitor_detail_page = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id);
		res.render("resident/visitorDetail", { visitor: visitor });
	} catch (error) {
		console.log(error);
	}
};

module.exports.register_visitor = async (req, res) => {
	try {
		const { name, cnic, reason, date } = req.body;
		await Visitor.insertOne({
			residentId: req.user._id,
			name: name,
			cnic: cnic,
			reason: reason,
			date: date,
		});
		req.session.message = "Visitor Registered Successfully!";
	} catch (error) {
		console.log(error);
		req.session.message = "Error Verifying Visitor";
	}
	res.redirect("/resident/visitors/unverified");
};
