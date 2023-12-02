const User = require("../../models/user");
const Resident = require("../../models/resident");
const Bill = require("../../models/bill");
const Payment = require("../../models/payment");
const Visitor = require("../../models/visitor");
const Complaint = require("../../models/complaint");
const Booking = require("../../models/booking");

const { validatePassword, genPassword } = require("../../utils/passwordUtils");

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

module.exports.register_visitor_page = async (req, res) => {
	try {
		res.render("resident/registerVisitor");
	} catch (error) {
		console.log(error);
	}
};

module.exports.register_visitor = async (req, res) => {
	try {
		const { name, cnic, reason, date } = req.body;
		await Visitor.insertMany({
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

module.exports.solved_complaints = async (req, res) => {
	try {
		const complaints = await Complaint.find({
			residentId: req.user._id,
			isSolved: true,
		});
		res.render("resident/solvedComplaints", {
			complaints: complaints,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.unsolved_complaints = async (req, res) => {
	try {
		const message = req.session.message;
		req.session.message = null;
		const complaints = await Complaint.find({
			residentId: req.user._id,
			isSolved: false,
		});
		res.render("resident/unsolvedComplaints", {
			complaints: complaints,
			message: message,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.complaint_detail_page = async (req, res) => {
	try {
		const complaint = await Complaint.findById(req.params.id);
		res.render("resident/complaintDetail", { complaint: complaint });
	} catch (error) {
		console.log(error);
	}
};

module.exports.register_complaint_page = async (req, res) => {
	try {
		res.render("resident/registerComplaint");
	} catch (error) {
		console.log(error);
	}
};

module.exports.register_complaint = async (req, res) => {
	try {
		const { title, description, date } = req.body;
		await Complaint.insertMany({
			residentId: req.user._id,
			title: title,
			description: description,
			date: date,
		});
		req.session.message = "Complaint registered successfully!";
	} catch (error) {
		console.log(error);
		req.session.message = "Error registering complaint!";
	}
	res.redirect("/resident/complaints/unsolved");
};

module.exports.update_profile_page = async (req, res) => {
	try {
		res.render("resident/updateProfile");
	} catch (error) {
		console.log(error);
	}
};

module.exports.update_profile = async (req, res) => {
	try {
		const { username, email, old_password, new_password } = req.body;
		if (username) {
			await User.findByIdAndUpdate(req.user.user._id, { username: username });
		}
		// if (email) {
		// 	query.email = email;
		// }
		if (old_password || new_password) {
			const isValid = validatePassword(
				old_password,
				req.user.user.hash,
				req.user.user.salt
			);
			if (isValid) {
				const { salt, hash } = genPassword(new_password);
				await User.findByIdAndUpdate(req.user.user._id, {
					salt: salt,
					hash: hash,
				});
			}
		}
		req.session.message = "Profile updated successfully!";
	} catch (error) {
		console.log(error);
		req.session.message = "Error updating profile!";
	}
	res.redirect("/resident/home");
};

module.exports.verified_bookings = async (req, res) => {
	try {
		const bookings = await Booking.find({
			residentId: req.user.id,
			isVerified: true,
		});
		res.render("resident/verifiedBookings", { bookings: bookings });
	} catch (error) {
		console.log(error);
	}
};

module.exports.unverified_bookings = async (req, res) => {
	try {
		let message = req.session.message;
		req.session.message = null;
		const bookings = await Booking.find({
			residentId: req.user.id,
			isVerified: false,
		});
		res.render("resident/verifiedBookings", { bookings: bookings });
	} catch (error) {
		console.log(error);
	}
};

module.exports.register_booking_page = async (req, res) => {
	try {
		res.render("resident/registerBooking");
	} catch (error) {
		console.log(error);
	}
};

module.exports.register_booking = async (req, res) => {
	let message;
	try {
		const { location, startTime, endTime } = req.body;
		await Booking.insertMany({
			residentId: req.user._id,
			location: location,
			startTime: startTime,
			endTime: endTime,
		});
		message = "Booking registered successfully!";
	} catch (error) {
		console.log(error);
		message = "Error in booking!";
	}
	res.redirect("/resident/bookings/unverified");
};
