const express = require("express");
const { adminAuth } = require("../../middlewares/adminAuth");
const {
	home,
	get_verified_residents,
	get_unverified_residents,
	verify_resident,
	get_unsold_houses,
	buy_house,
	get_sold_houses,
	generate_bill,
	sell_house,
	get_residents_houses,
	get_residents_houses_bills,
} = require("../../controllers/admin/adminController");

const adminRouter = express.Router();

adminRouter.get("/home", adminAuth, home);

adminRouter.get("/residents/verified", adminAuth, get_verified_residents);
adminRouter.get("/residents/unverified", adminAuth, get_unverified_residents);

adminRouter.post("/residents/verify", adminAuth, verify_resident);

adminRouter.get("/unsold-houses", adminAuth, get_unsold_houses);

adminRouter.put("/houses/buy", adminAuth, buy_house);

adminRouter.get("/sold-houses", adminAuth, get_sold_houses);

adminRouter.put("/houses/sell", adminAuth, sell_house);

//! residents-houses
adminRouter.get("/residents-houses", adminAuth, get_residents_houses);

//! Generate a bill
adminRouter.post("/bills/generate", adminAuth, generate_bill);

//! residents-houses-bills
adminRouter.get(
	"/residents-houses-bills",
	adminAuth,
	get_residents_houses_bills
);

module.exports = adminRouter;
