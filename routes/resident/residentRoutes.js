const express = require("express");

const { residentAuth } = require("../../middlewares/residentAuth");
const {
	home,
	get_bills,
	// payment_details,
	pay_bill,
} = require("../../controllers/resident/residentController");

const residentRouter = express.Router();

residentRouter.get("/home", residentAuth, home);

residentRouter.get("/bills", residentAuth, get_bills);

residentRouter.post("/bills/pay", residentAuth, pay_bill);

// residentRouter.post("/bills/payment-details", residentAuth, payment_details);

module.exports = residentRouter;
