const mongoose = require("mongoose");
const { DB_STRING } = require("../config/index");

const connect = async () => {
	try {
		await mongoose.connect(DB_STRING, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("DB connected successfully");
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	connect: connect,
};
