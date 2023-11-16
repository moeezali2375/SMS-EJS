const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const Admin = require("../models/admin");
const Resident = require("../models/resident");
const { validatePassword } = require("../utils/passwordUtils");

//! In case we have some custom name for username and password to look for in the db
const customFields = {
	usernameFields: "username",
	passwordFields: "password",
};

const verifyCallback = (username, password, done) => {
	User.findOne({ username: username })
		.then((user) => {
			if (!user) {
				return done(null, false); //HELP No user found
			}
			//! hash the entered-password and check it with stored password
			const isValid = validatePassword(password, user.hash, user.salt);
			if (isValid) {
				return done(null, user); //HELP MATCH!
			} else {
				return done(null, false);
			}
		})
		.catch((error) => {
			done(error);
		});
};

const Strategy = new LocalStrategy(verifyCallback, customFields);

passport.use(Strategy);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
	try {
		let user = await User.findById(userId);
		//! Pass admin attributes to req.user
		if (user.isAdmin) {
			const result = await Admin.aggregate()
				.match({ userId: user._id })
				.lookup({
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				})
				.unwind("user")
				.exec();
			user = result[0];
		}
		//! Pass resident attributes to req.user
		else {
			const result = await Resident.aggregate()
				.match({ userId: user._id })
				.lookup({
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				})
				.unwind("user")
				.exec();
			user = result[0];
		}
		done(null, user);
	} catch (error) {
		done(error);
	}
});

module.exports = {
	initialize: passport.initialize(),
	session: passport.session(),
};
