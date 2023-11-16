require("dotenv").config();

const PORT = process.env.PORT;
const DB_STRING = process.env.DB_STRING;
const SECRET = process.env.SECRET;
const CLIENT = process.env.CLIENT;
const erate = 60;
const grate = 20;
const wrate = 10;
const daylimit = 5;
module.exports = {
	PORT,
	DB_STRING,
	SECRET,
	CLIENT,
	erate,
	grate,
	wrate,
	daylimit,
};
