// Service
const {
	getAllProvinces,
} = require('./../services/decentralization/province.service');

// Utils func
const { initCart, allCategory } = require('./../utils/constant');

/**
 * Apply to all route for update cart, user info
 */
module.exports.init = async function (req, res, next) {
	try {
		// Sessions
		req.app.locals.user = req.user || null;
		req.app.locals.cart = req.session.cart || initCart;
		!req.session.cart ? (req.session.cart = initCart) : '';

		// Navbar items
		req.app.locals.categories = allCategory;

		// Dynamic select options
		const provinces = await getAllProvinces();
		req.app.locals.provinces = provinces;
	} catch (error) {
		next(error);
	}
	next();
};
