const express = require("express");

const { residentAuth } = require("../../middlewares/residentAuth");
const {
	home,
	//1
	get_bills_paid,
	get_bills_unpaid,
	bill_detail_page,
	pay_bill,
	verified_visitors,
	unverified_visitors,
	visitor_detail_page,
	register_visitor,
	register_visitor_page,
	solved_complaints,
	unsolved_complaints,
	complaint_detail_page,
	register_complaint_page,
	register_complaint,
	update_profile,
	update_profile_page,
	//2
} = require("../../controllers/resident/residentController");

const residentRouter = express.Router();

residentRouter.get("/home", residentAuth, home);

residentRouter.get("/bills/paid", residentAuth, get_bills_paid);

residentRouter.get("/bills/unpaid", residentAuth, get_bills_unpaid);

residentRouter.get("/bills/:id/details", residentAuth, bill_detail_page);

residentRouter.post("/bills/:id/pay", residentAuth, pay_bill);

residentRouter.get("/visitors/verified", residentAuth, verified_visitors);

residentRouter.get("/visitors/unverified", residentAuth, unverified_visitors);

residentRouter.get("/visitors/:id/details", residentAuth, visitor_detail_page);

residentRouter.get("/visitors/register", residentAuth, register_visitor_page);

residentRouter.post("/visitors/register", residentAuth, register_visitor);

residentRouter.get("/complaints/solved", residentAuth, solved_complaints);

residentRouter.get("/complaints/unsolved", residentAuth, unsolved_complaints);

residentRouter.get(
	"/complaints/:id/details",
	residentAuth,
	complaint_detail_page
);

residentRouter.post(
	"/complaints/register",
	residentAuth,
	register_complaint_page
);

residentRouter.post("/complaints/register", residentAuth, register_complaint);

residentRouter.get("/profile/update", residentAuth, update_profile_page);

residentRouter.post("/profile/update", residentAuth, update_profile);

module.exports = residentRouter;
