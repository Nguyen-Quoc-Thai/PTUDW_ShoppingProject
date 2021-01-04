const Province = require('./../models/dist/province.model');

// Utils func
const { initCart, allCategory } = require('./../utils/constant');

/**
 * Apply to all route for update cart, user info
 */
module.exports.init = function (req, res, next) {
	try {
		// Sessions
		req.app.locals.user = req.user || null;
		req.app.locals.cart = req.session.cart || initCart;
		!req.session.cart ? (req.session.cart = initCart) : '';

		// Navbar items
		req.app.locals.categories = allCategory;

		// Dynamic select options
		Province.find()
			.sort({ name_with_type: 'asc' })
			.then((provinces) => {
				req.app.locals.provinces = provinces;
			})
			.catch((error) => next(error));
	} catch (error) {
		next(error);
	}
	next();
};
