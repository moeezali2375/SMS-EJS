module.exports.adminAuth = (req, res, next) => {
	if (req.isAuthenticated() && req.user.user.isAdmin) {
		return next();
	} else {
		req.session.notification = "Please log in to continue!";
		res.redirect("/auth/login");
	}
};
