const User = require('./../models/user.model');
const Cart = require('./../models/cart.model');
const Checkout = require('./../models/checkout.model');

// Utils func
const { initCart } = require('./../utils/constant');

/**
 * Get cart checkout
 */
module.exports.getCheckout = async (req, res, next) => {
	try {
		res.render('pages/checkout', {
			msg: 'success',
		});
	} catch (error) {
		console.log(error.message);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * Checkout cart
 */
module.exports.postCheckout = async (req, res, next) => {
	const { user, body } = req;

	const SHIPPING_FEE = 25000;

	try {
		const cart = await Cart.findOne({ userId: user._id, status: 'waiting' });

		// Destructuring info for add to checkout
		const { userId, _id, status, items, totalQuantity, totalCost } = cart;
		const {
			address,
			city,
			district,
			village,
			phone,
			firstName,
			lastName,
		} = body;

		const checkoutObj = {
			userId,
			cartId: _id,
			status,
			items,
			totalQuantity,
			totalCost,
			address,
			city,
			district,
			village,
			phone,
			receiver: firstName + ' ' + lastName,
			shippingFee: SHIPPING_FEE,
			paymentMethod: 'cod',
			totalPayment: parseInt(totalCost) + SHIPPING_FEE,
		};

		// Create checkout
		const checkout = new Checkout(checkoutObj);

		// If user phone number is default value -> only change one time
		if (user.phone !== '0987654321') body.phone = user.phone;
		body.email = user.email;

		// Update status of cart
		cart.status = 'staging';

		await Promise.all([
			checkout.save(),
			cart.save(),
			User.updateOne({ _id: user._id }, { $set: body }),
		]);

		// Reset cart
		req.session.cart = initCart;

		res.redirect('/user/account/dashboard');
	} catch (error) {
		console.log(error);
		res.render('error', {
			msg: error.message,
			error,
		});
	}
};
