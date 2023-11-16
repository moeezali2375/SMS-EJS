const express = require("express");
const {
	register,
	login,
	login_failure,
	logout,
	login_success,
	register_admin,
	login_page,
} = require("../../controllers/auth/authController");

const authRouter = express.Router();

authRouter.get("/login", login_page);

authRouter.post("/register", register);
authRouter.get("/register", (req, res) => {
	var array = [];
	array.push(
		{
			username: "moeez",
			phone: "123",
		},
		{
			username: "bilal",
			phone: "456",
		},
		{
			username: "affan",
			phone: "789",
		}
	);
	res.render("auth/login", { array: array });
});
authRouter.post("/login", login);

authRouter.get("/login-failure", login_failure);
authRouter.get("/login-success", login_success);

authRouter.post("/logout", logout);

authRouter.post("/register-admin", register_admin);
module.exports = authRouter;
