const express = require("express");
const {
	register,
	login,
	login_failure,
	logout,
	login_success,
	register_admin,
	login_page,
	register_page,
} = require("../../controllers/auth/authController");

const authRouter = express.Router();

authRouter.get("/login-failure", login_failure);
authRouter.get("/login-success", login_success);

authRouter.get("/login", login_page);
authRouter.get("/register", register_page);

authRouter.post("/login", login);
authRouter.post("/register", register);

authRouter.post("/logout", logout);

authRouter.post("/register-admin", register_admin);
module.exports = authRouter;
