const express = require("express");
const router = express.Router();

const authRouter = require("./auth/authRoutes");
const adminRouter = require("./admin/adminRoutes");
const residentRouter = require("./resident/residentRoutes");

router.get("/", (req, res) => {
	res.send("<h1>Hello</h1>");
});

router.get("/test", (req, res) => {
	res.render("test/test");
});

// router.post("/test", (req, res) => {
// 	console.log(req.body);
// 	res.render("test/test");
// });

router.use("/auth", authRouter);

router.use("/admin", adminRouter);

router.use("/resident", residentRouter);

module.exports = router;
