module.exports.residentAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user.isVerified) {
			return next();
		} else {
			res.render("auth/login", { notification: "You are not verified yet!" });
		}
	} else res.status(403).send("Login!");
};
