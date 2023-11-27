const mongoose = require("mongoose");

const Resident = require("../../models/resident");
const House = require("../../models/house");
const Bill = require("../../models/bill");
const Complaint = require("../../models/complaint");
const Visitor = require("../../models/visitor");
const Booking = require("../../models/booking");
const Payment = require("../../models/payment");

const { erate, grate, wrate, daylimit } = require("../../config/index");
const { due_date, calculate_bill } = require("../../utils/billUtils");

module.exports.home = (req, res) => {
	res.render("admin/home");
};

module.exports.get_unverified_residents = async (req, res) => {
	try {
		const query = {};

		query.isVerified = 0;

		const unverified = await Resident.find(query);
		res.render("admin/unverifiedResidents", { residents: unverified });
	} catch (error) {
		console.log(error);
	}
};

module.exports.verify_resident = async (req, res) => {
	try {
		const userId = req.body.userId;
		const resident = await Resident.findOne({ userId: userId });
		if (resident.isVerified) res.status(400).send("Resident already verified!");
		else {
			await Resident.findOneAndUpdate(
				{
					userId: userId,
				},
				{
					isVerified: true,
				}
			);
			res.redirect("/admin/residents/unverified");
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.get_verified_residents = async (req, res) => {
	try {
		const query = {};

		query.isVerified = 1;

		const verified = await Resident.find(query);
		res.render("admin/verifiedResidents", { residents: verified });
	} catch (error) {
		console.log(error);
	}
};

module.exports.resident_details = async (req, res) => {
	try {
		const message = req.session.message;
		req.session.message = null;
		const id = req.params.id;
		const resident = await Resident.findById(id);
		const house = await House.findOne({ residentId: id });
		const bills = await Bill.find({ residentId: id });
		res.render("admin/details", {
			house: house,
			resident: resident,
			bills: bills,
			message: message,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.buy_house_page = async (req, res) => {
	const available_houses = await House.find({ residentId: null });
	const resident = await Resident.findById(req.params.id);

	res.render("admin/buyHouse", {
		resident: resident,
		houses: available_houses,
	});
};

module.exports.buy_house = async (req, res) => {
	try {
		const { residentId, houseId } = req.body;
		const house = await House.findOne({ _id: houseId });
		if (!house.residentId) {
			await House.findOneAndUpdate(
				{
					_id: houseId,
				},
				{
					residentId: residentId,
				}
			);
			req.session.message = "House Bought Successfully!";
		} else {
			req.session.message = "Error!";
		}
		let goBack = "/admin/residents/verified/" + residentId;
		res.redirect(goBack);
	} catch (error) {
		console.log(error);
	}
};

module.exports.sell_house = async (req, res) => {
	try {
		const { residentId, houseId } = req.body;
		const house = await House.findOne({
			_id: houseId,
			residentId: residentId,
		});
		if (!house) throw new Error("No House to Sell!");
		else {
			await House.findOneAndUpdate(
				{
					_id: houseId,
				},
				{
					residentId: null,
				}
			);
			req.session.message = "House Sold Successfully!";
			let goBack = "/admin/residents/verified/" + residentId;
			res.redirect(goBack);
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.generate_bill_page = async (req, res) => {
	try {
		const message = req.session.message;
		req.session.message = null;
		const id = req.params.id;
		const resident = await Resident.findById(id);
		const house = await House.findOne({ residentId: id });
		res.render("admin/generateBill", {
			message: message,
			house: house,
			resident: resident,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.generate_bill = async (req, res) => {
	const { residentId, billType, currentUnits } = req.body;
	const session = await mongoose.startSession();
	try {
		session.startTransaction();
		const house = await House.findOne({ residentId: residentId });
		let oldUnits = 0;
		let amount = 0;
		if (billType == 0) {
			oldUnits = house.emeter;
			await House.findOneAndUpdate(
				{ residentId: residentId },
				{ emeter: currentUnits },
				{ session: session }
			);
			amount = calculate_bill(oldUnits, currentUnits, erate);
		} else if (billType == 1) {
			oldUnits = house.gmeter;
			await House.findOneAndUpdate(
				{ residentId: residentId },
				{ gmeter: currentUnits },
				{ session: session }
			);
			amount = calculate_bill(oldUnits, currentUnits, grate);
		} else if (billType == 2) {
			oldUnits = house.wmeter;
			await House.findOneAndUpdate(
				{ residentId: residentId },
				{ wmeter: currentUnits },
				{ session: session }
			);
			amount = calculate_bill(oldUnits, currentUnits, wrate);
		}
		await Bill.insertMany(
			{
				residentId: residentId,
				billType: billType,
				oldUnits: oldUnits,
				currentUnits: currentUnits,
				dueDate: due_date(new Date(), daylimit),
				amount: amount,
			},
			{
				session: session,
			}
		);
		await session.commitTransaction();
		session.endSession();
		req.session.message = "Bill Generated!";
		let goBack = "/admin/residents/verified/" + residentId + "/bills/generate";
		res.redirect(goBack);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		req.session.message = "How would I generate a -ve bill?";
		let goBack = "/admin/residents/verified/" + residentId + "/bills/generate";
		res.redirect(goBack);
	}
};

module.exports.solved_complaints_page = async (req, res) => {
	try {
		const resolved_complaints = await Complaint.aggregate([
			{ $match: { isSolved: true } },
		])
			.lookup({
				from: "residents",
				localField: "residentId",
				foreignField: "_id",
				as: "resident",
			})
			.unwind("resident")
			.exec();
		res.render("admin/resolvedComplaints", {
			complaints: resolved_complaints,
			message: null,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.unresolved_complaints_page = async (req, res) => {
	try {
		const message = req.session.message;
		req.session.message = null;
		const unresolved_complaints = await Complaint.aggregate([
			{ $match: { isSolved: false } },
		])
			.lookup({
				from: "residents",
				localField: "residentId",
				foreignField: "_id",
				as: "resident",
			})
			.unwind("resident")
			.exec();
		res.render("admin/unresolvedComplaints", {
			complaints: unresolved_complaints,
			message: message,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.complaint_detail_page = async (req, res) => {
	try {
		const complaint = await Complaint.findById(req.params.id);
		const resident = await Resident.findById(complaint.residentId);
		const house = await House.findOne({ residentId: resident._id });
		res.render("admin/complaintDetails", {
			complaint: complaint,
			resident: resident,
			house: house,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.resolve_complaint = async (req, res) => {
	try {
		await Complaint.findOneAndUpdate(
			{
				_id: req.params.id,
			},
			{
				isSolved: true,
			}
		);
		req.session.message = "Complaint resolved Successfully!";
	} catch (error) {
		console.log(error);
		req.session.message = "Error resolving complaint!";
	}
	res.redirect("/admin/complaints/unresolved");
};

module.exports.unverified_visitors = async (req, res) => {
	const message = req.session.message;
	req.session.message = null;
	try {
		const unverified_visitors = await Visitor.aggregate([
			{ $match: { isVerified: false } },
		])
			.lookup({
				from: "residents",
				localField: "residentId",
				foreignField: "_id",
				as: "registeredBy",
			})
			.unwind("registeredBy")
			.exec();
		//!
		console.log(unverified_visitors);
		res.render("admin/unverifiedVisitors", {
			visitors: unverified_visitors,
			message: message,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.verified_visitors = async (req, res) => {
	try {
		const verified_visitors = await Visitor.aggregate([
			{ $match: { isVerified: true } },
		])
			.lookup({
				from: "residents",
				localField: "residentId",
				foreignField: "_id",
				as: "registeredBy",
			})
			.unwind("registeredBy")
			.exec();
		//!
		console.log(verified_visitors);
		res.render("admin/verifiedVisitors", { visitors: verified_visitors });
	} catch (error) {
		console.log(error);
	}
};

module.exports.visitor_detail_page = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id);
		const resident = await Resident.findById(visitor.residentId);
		console.log(visitor, resident);
		res.render("admin/visitorDetail", {
			visitor: visitor,
			resident: resident,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.verify_visitor = async (req, res) => {
	let message = null;
	try {
		await Visitor.findByIdAndUpdate(req.params.id, {
			isVerified: true,
		});
		message = "Visitor Verified Successfully";
	} catch (error) {
		console.log(error);
		message = "Error Verifying Visitor";
	}
	res.redirect("/admin/visitors/unverified");
};

module.exports.unverified_bookings = async (req, res) => {
	const message = req.session.message;
	req.session.message = null;
	let unverified_bookings;
	try {
		unverified_bookings = await Booking.aggregate([
			{
				$match: {
					isVerified: false,
				},
			},
		])
			.lookup({
				from: "residents",
				localField: "residentId",
				foreignField: "_id",
				as: "resident",
			})
			.unwind("resident")
			.exec();
	} catch (error) {
		console.log(error);
	}
	res.render("admin/unverifiedBookings", {
		bookings: unverified_bookings,
		message: message,
	});
};

module.exports.verified_bookings = async (req, res) => {
	let verified_bookings;
	try {
		verified_bookings = await Booking.aggregate([
			{
				$match: {
					isVerified: true,
				},
			},
		])
			.lookup({
				from: "residents",
				localField: "residentId",
				foreignField: "_id",
				as: "resident",
			})
			.unwind("resident")
			.exec();
	} catch (error) {
		console.log(error);
	}
	res.render("admin/verifiedBookings", {
		bookings: verified_bookings,
	});
};

module.exports.verify_booking = async (req, res) => {
	let message;
	try {
		await Booking.findByIdAndUpdate(req.body.bookingId, {
			isVerified: true,
		});
		message = "Booking verified successfully!";
	} catch (error) {
		console.log(error);
		message = "Error verifying booking!";
	}
	res.redirect("/admin/bookings/unverified");
};

module.exports.get_bills_unpayed = async (req, res) => {
	let message = req.session.message;
	req.session.message = null;
	let bills;
	try {
		bills = await Bill.aggregate([
			{
				$match: {
					isPayed: false,
				},
			},
		])
			.lookup({
				from: "residents",
				localField: "residentId",
				foreignField: "_id",
				as: "resident",
			})
			.unwind("resident")
			.exec();
		console.log(bills);
	} catch (error) {
		console.log(error);
	}
	res.render("admin/unpaidBills", { bills: bills, message: message });
};

module.exports.bill_details = async (req, res) => {
	try {
		const bill = await Bill.findById(req.params.id);
		const resident = await Resident.findById(bill.residentId);
		const payment = await Payment.findOne({ billId: bill._id });
		console.log(bill, resident, payment);
		res.render("admin/billDetail", {
			bill: bill,
			resident: resident,
			payment: payment,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.verify_payment = async (req, res) => {
	let message;
	try {
		await Bill.findByIdAndUpdate(req.params.id, {
			isPayed: true,
		});
		message = "Payment verified successfully!";
	} catch (error) {
		console.log(error);
		message = "Error verfying payment!";
	}
	res.redirect("/admin/bills/unpaid");
};

module.exports.get_bills_payed = async (req, res) => {
	try {
		let message = req.session.message;
		req.session.message = null;
		let bills;
		try {
			bills = await Bill.aggregate([
				{
					$match: {
						isPayed: true,
					},
				},
			])
				.lookup({
					from: "residents",
					localField: "residentId",
					foreignField: "_id",
					as: "resident",
				})
				.unwind("resident")
				.exec();
			console.log(bills);
		} catch (error) {
			console.log(error);
		}
		res.render("admin/paidBills", { bills: bills, message: message });
	} catch (error) {
		console.log(error);
	}
};
