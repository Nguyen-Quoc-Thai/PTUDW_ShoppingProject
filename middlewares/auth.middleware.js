/**
 * Confirm user logged
 */
module.exports.checkAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/user/auth');
};

/**
 * Confirm user not login
 */
module.exports.checkNotAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}

	next();
};
