module.exports.residentAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user.isVerified) {
			return next();
		} else {
			res.status(200).json({ msg: "You are not verified yet!" });
		}
	} else res.status(403).send("Login!");
};
