const session = require("express-session");
const MongoStore = require("connect-mongo");
const { SECRET, DB_STRING } = require("../config/index");

module.exports = session({
	secret: SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		// maxAge: 1000 * 60 * 60 * 24,
		maxAge: 1000 * 60 * 60,
	},
	store: MongoStore.create({
		mongoUrl: DB_STRING,
	}),
});
