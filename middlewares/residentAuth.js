module.exports.residentAuth = (req, res, next) => {
	console.log(req.user);
	if (req.isAuthenticated() && !req.user.user.isAdmin) {
		if (req.user.isVerified) {
			return next();
		} else {
			req.session.notification = "You are not verified yet!";
			res.redirect("/auth/login");
		}
	} else {
		req.session.notification = "Please log in to continue!";
		res.redirect("/auth/login");
	}
};
