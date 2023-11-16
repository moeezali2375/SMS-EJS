module.exports.adminAuth = (req, res, next) => {
	if (req.isAuthenticated() && req.user.user.isAdmin) {
		return next();
	} else res.status(403).send("Login!");
};
