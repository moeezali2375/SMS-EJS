const mongoose = require("mongoose");
const User = require("../../models/user");
const Resident = require("../../models/resident");
const Admin = require("../../models/admin");
const passport = require("passport");
const { genPassword } = require("../../utils/passwordUtils");

module.exports.login_success = async (req, res) => {
	if (req.isAuthenticated()) {
		if (req.user.user.isAdmin) {
			res.redirect("/admin/home");
		} else {
			res.redirect("/resident/home");
		}
	} else res.render("error/400");
};

module.exports.login_failure = (req, res) => {
	req.session.notification = "Username or Password Incorrect!";
	res.redirect("/auth/login");
};

module.exports.login_page = async (req, res) => {
	const notification = req.session.notification;
	req.session.notification = null;
	res.render("auth/login", { notification: notification });
};

module.exports.register_page = async (req, res) => {
	res.render("auth/register");
};

module.exports.login = passport.authenticate("local", {
	failureRedirect: "login-failure",
	successRedirect: "login-success",
});

module.exports.register = async (req, res) => {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();
		const { username, password, name, address, cnic } = req.body;
		const salt_hash = genPassword(password);
		const new_user = await User.insertMany(
			{
				username: username,
				salt: salt_hash.salt,
				hash: salt_hash.hash,
			},
			{
				session: session,
			}
		);
		await Resident.insertMany(
			{
				userId: new_user[0]._id,
				name: name,
				address: address,
				cnic: cnic,
			},
			{ session: session }
		);

		await session.commitTransaction();
		session.endSession();
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.log(error);
	}
	res.redirect("/auth/login");
};

module.exports.logout = (req, res) => {
	if (req.isAuthenticated()) {
		req.logout((error) => {
			if (error) res.status(400).send("Error in logout!\n" + error);
		});
		res.redirect("/auth/login");
	} else res.status(403).send("Login again!");
};

module.exports.register_admin = async (req, res) => {
	const session = await mongoose.startSession();
	try {
		const { username, password, name } = req.body;
		const salt_hash = genPassword(password);
		session.startTransaction();
		const new_user = await User.insertMany(
			{
				username: username,
				salt: salt_hash.salt,
				hash: salt_hash.hash,
				isAdmin: true,
			},
			{
				session: session,
			}
		);
		await Admin.insertMany(
			{
				userId: new_user[0]._id,
				name: name,
			},
			{
				session: session,
			}
		);
		await session.commitTransaction();
		session.endSession();

		res.status(201).send("Admin Registered Successfully!");
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		res.status(409).send("User already exists\n" + error.message);
	}
};
