const mongoose = require("mongoose");

const User = require("../../models/user");
const Resident = require("../../models/resident");
const House = require("../../models/house");
const Bill = require("../../models/bill");

const { erate, grate, wrate, daylimit } = require("../../config/index");
const { due_date, calculate_bill } = require("../../utils/billUtils");

module.exports.home = (req, res) => {
	res.render("admin/home");
};

module.exports.get_verified_residents = async (req, res) => {
	try {
		const query = {};

		query.isVerified = 1;

		const verified = await Resident.find(query);
		res.render("admin/verifiedResidents", { residents: verified });
	} catch (error) {
		res.render("error/400");
	}
};

module.exports.get_unverified_residents = async (req, res) => {
	try {
		const query = {};

		query.isVerified = 0;

		const unverified = await Resident.find(query);
		res.render("admin/unverifiedResidents", { residents: unverified });
	} catch (error) {
		res.render("error/400");
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
		res.render("error/400");
	}
};

module.exports.resident_details = async (req, res) => {
	try {
		const id = req.params.id;
		const resident = await Resident.findById(id);
		const house = await House.findOne({ residentId: id });
		const bills = await Bill.find({ residentId: id });
		res.render("admin/details", {
			house: house,
			resident: resident,
			bills: bills,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.generate_bill_page = async (req, res) => {
	try {
		const id = req.params.id;
		const resident = await Resident.findById(id);
		const house = await House.findOne({ residentId: id });
		console.log(resident, house);
		res.render("admin/generateBill", {
			message: "",
			house: house,
			resident: resident,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.generate_bill = async (req, res) => {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();
		const { residentId, billType, currentUnits } = req.body;
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

		res.status(201).send("Bill Registered Successfully!");
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		res.render("admin/generateBill", { message: "Validation Failed" });
	}
};

module.exports.get_unsold_houses = async (req, res) => {
	try {
		const query = {
			$or: [
				{ residentId: null }, // Matches null values};
			],
		};

		// if (req.query.houseNo) query.houseNo = req.query.houseNo;
		// if (req.query.block) query.block = req.query.block;

		const houses = await House.find(query);

		res.status(200).json(houses);
	} catch (error) {
		res.status(400).send(error.message);
	}
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
			res.status(200).send("House Bought Successfully!");
		} else {
			throw new Error("House already Sold!");
		}
	} catch (error) {
		res.status(400).send(error.message);
	}
};

module.exports.get_sold_houses = async (req, res) => {
	try {
		const query = {
			$or: [{ residentId: { $ne: null } }],
		};

		const houses = await House.find(query);

		res.status(200).json(houses);
	} catch (error) {
		res.status(400).send(error.message);
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
			res.status(200).send("House Sold Successfully!");
		}
	} catch (error) {
		res.status(400).send(error.message);
	}
};

module.exports.get_residents_houses = async (req, res) => {
	try {
		const result = await Resident.aggregate()
			.lookup({
				from: "houses",
				localField: "_id",
				foreignField: "residentId",
				as: "house",
			})
			.unwind("house")
			.exec();
		res.status(200).json(result);
	} catch (error) {
		res.status(400).send(error.message);
	}
};

module.exports.get_residents_houses_bills = async (req, res) => {
	try {
		const result = await Resident.aggregate()
			.lookup({
				from: "houses",
				localField: "_id",
				foreignField: "residentId",
				as: "house",
			})
			.unwind("house")
			.lookup({
				from: "bills",
				localField: "_id",
				foreignField: "residentId",
				as: "bills",
			})
			.unwind("bills")
			.exec();
		res.status(200).json(result);
	} catch (error) {
		res.status(400).send(error.message);
	}
};
