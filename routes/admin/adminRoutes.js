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
	sell_house,
	//4
	generate_bill_page,
	generate_bill,
	//5
	solved_complaints_page,
	unresolved_complaints_page,
	complaint_detail_page,
	resolve_complaint,
	//6
	unverified_visitors,
	verified_visitors,
	visitor_detail_page,
	verify_visitor,
	//7
	unverified_bookings,
	verified_bookings,
	verify_booking,
	//8
	get_bills_unpayed,
	get_bills_payed,
	bill_details,
	verify_payment,
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
adminRouter.get(
	"/residents/verified/:id/houses/buy",
	adminAuth,
	buy_house_page
);
adminRouter.post("/houses/buy", adminAuth, buy_house);
adminRouter.post("/houses/sell", adminAuth, sell_house);
//4
adminRouter.get(
	"/residents/verified/:id/bills/generate",
	adminAuth,
	generate_bill_page
);
adminRouter.post("/bills/generate", adminAuth, generate_bill);
//5
adminRouter.get("/complaints/resolved", adminAuth, solved_complaints_page);
adminRouter.get(
	"/complaints/unresolved",
	adminAuth,
	unresolved_complaints_page
);
adminRouter.get("/complaints/:id", adminAuth, complaint_detail_page);
adminRouter.post("/complaints/:id/resolve", adminAuth, resolve_complaint);
//6
adminRouter.get("/visitors/unverified", adminAuth, unverified_visitors);
adminRouter.get("/visitors/verified", adminAuth, verified_visitors);
adminRouter.get("/visitors/:id", adminAuth, visitor_detail_page);
adminRouter.post("/visitors/:id/verify", adminAuth, verify_visitor);
//7
adminRouter.get("/bookings/unverified", adminAuth, unverified_bookings);
adminRouter.get("/bookings/verified", adminAuth, verified_bookings);
adminRouter.post("/bookings/verify", adminAuth, verify_booking);
//8
adminRouter.get("/bills/unpaid", adminAuth, get_bills_unpayed);
adminRouter.get("/bills/paid", adminAuth, get_bills_payed);
adminRouter.get("/bills/:id/details", adminAuth, bill_details);
adminRouter.post("/bills/:id/verify", adminAuth, verify_payment);
module.exports = adminRouter;
