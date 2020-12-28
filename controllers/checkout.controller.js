const User = require('./../models/user.model');
const Cart = require('./../models/cart.model');
const Checkout = require('./../models/checkout.model');

const { postSignUp } = require('./user.controller');

const { initCart } = require('./../utils/constant');

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

module.exports.postCheckout = async (req, res, next) => {
	const { user, body } = req;

	try {
		if (!user) {
			if (req.body.createAcc === 'on') {
				return await postSignUp(req, res, next);
			} else {
				return res.redirect('back');
			}
		}

		console.log(123);
		const cart = await Cart.findOne({ userId: user._id, status: 'waiting' });

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

		body.phone = user.phone;
		body.email = user.email;

		// check if 2 add diff

		const shippingFee = 25000;

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
			shippingFee,
			paymentMethod: 'cod',
			totalPayment: parseInt(totalCost) + shippingFee,
		};

		const checkout = new Checkout(checkoutObj);
		cart.status = 'staging';
		await Promise.all([
			checkout.save(),
			cart.save(),
			User.updateOne({ _id: user._id }, { $set: body }),
		]);

		console.log(checkout);
		// req.session.checkout = checkout;
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
