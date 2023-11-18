const express = require("express");
const { adminAuth } = require("../../middlewares/adminAuth");
const {
	home,
	//1
	get_unverified_residents,
	verify_resident,
	//2
	get_verified_residents,
	resident_details,
	//3
	buy_house_page,
	buy_house,
	//4
	generate_bill_page,
	get_unsold_houses,
	get_sold_houses,
	generate_bill,
	sell_house,
	get_residents_houses,
	get_residents_houses_bills,
} = require("../../controllers/admin/adminController");

const adminRouter = express.Router();

adminRouter.get("/home", adminAuth, home);
//1
adminRouter.get("/residents/unverified", adminAuth, get_unverified_residents);
adminRouter.post("/residents/verify", adminAuth, verify_resident);
//2
adminRouter.get("/residents/verified", adminAuth, get_verified_residents);
adminRouter.get("/residents/verified/:id", adminAuth, resident_details);
//3
adminRouter.get("/residents/verified/:id/houses/buy", adminAuth, buy_house_page);
adminRouter.post("/houses/buy", adminAuth, buy_house);
adminRouter.post("/houses/sell", adminAuth, sell_house);
//4
adminRouter.get(
	"/residents/verified/:id/bills/generate",
	adminAuth,
	generate_bill_page
);

adminRouter.post("/bills/generate", adminAuth, generate_bill);

adminRouter.get("/unsold-houses", adminAuth, get_unsold_houses);


adminRouter.get("/sold-houses", adminAuth, get_sold_houses);

//! residents-houses
adminRouter.get("/residents-houses", adminAuth, get_residents_houses);



//! residents-houses-bills
adminRouter.get(
	"/residents-houses-bills",
	adminAuth,
	get_residents_houses_bills
);

module.exports = adminRouter;
