const express = require("express");

const { residentAuth } = require("../../middlewares/residentAuth");
const {
	home,
	get_bills_paid,
	get_bills_unpaid,
	bill_detail_page,
} = require("../../controllers/resident/residentController");

const residentRouter = express.Router();

residentRouter.get("/home", residentAuth, home);

residentRouter.get("/bills/paid", residentAuth, get_bills_paid);

residentRouter.get("/bills/unpaid", residentAuth, get_bills_unpaid);

residentRouter.get("/bills/:id/details", residentAuth, bill_detail_page);

residentRouter.post("/bills/:id/pay", residentAuth);

module.exports = residentRouter;
