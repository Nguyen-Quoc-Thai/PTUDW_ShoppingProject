// Services
const CartServices = require('./../services/cart.service');

/**
 * Get cart items
 */
module.exports.getCart = async (req, res, next) => {
	const { user } = req;

	try {
		let { cart } = req.session;

		if (user) {
			const userCart = await CartServices.findOne({
				userId: user._id,
				status: 'waiting',
			});

			if (!userCart) {
				cart = CartServices.new({ userId: user._id });
				await cart.save();
			} else cart = userCart;
		}

		req.app.locals.cart = cart;
		return res.render('pages/cart', {
			msg: 'success',
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: 'Fail to fetch cart!',
			error,
		});
	}
};
