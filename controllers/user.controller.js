const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const slug = require('slug');
const passport = require('passport');

// Model
const User = require('./../models/user.model');
const Cart = require('./../models/cart.model');
const Checkout = require('./../models/checkout.model');

// Utils func
const { sendMail } = require('./../config/nodemailer');
const { mergeCart } = require('./../utils/statistic');

const TOKEN_LIFE = process.env.TOKEN_LIFE;
const JWT_KEY = process.env.JWT_KEY;
const REMEMBER_LIFE = process.env.REMEMBER_LIFE;

/**
 * Get auth page
 */
module.exports.getAuth = async (req, res, next) => {
	res.render('pages/auth', {
		msg: 'success',
		respond: '',
		data: '',
	});
};

/**
 * Sign up an account
 */
module.exports.postSignUp = async (req, res, next) => {
	const { body } = req;

	try {
		// Destructuring sign up info
		const {
			firstName,
			lastName,
			email,
			phone,
			password,
			retypePassword,
			address = '',
			city = '',
			district = '',
			village = '',
		} = body;

		// Validate info
		if (password.length < 6)
			return res.render('pages/auth', {
				data: req.body,
				respond: {
					msg: 'ValidatorError',
					err: 'Chiều dài mật khẩu tối thiểu là 6!',
				},
			});

		if (password.length > 20)
			return res.render('pages/auth', {
				data: req.body,
				respond: {
					msg: 'ValidatorError',
					err: 'Chiều dài mật khẩu tối đa là 20!',
				},
			});

		if (password !== retypePassword)
			return res.render('pages/auth', {
				data: req.body,
				respond: {
					msg: 'ValidatorError',
					retypePassword: 'Nhập lại mật khẩu không khớp!',
				},
			});

		try {
			const encryptedPassword = await bcrypt.hash(password, 10);
			const passwordResetToken = crypto.randomBytes(16).toString('hex');

			// Create user account
			const userObj = {
				firstName,
				lastName,
				email,
				phone,
				slugName: slug(firstName + ' ' + lastName),
				password: encryptedPassword,
				passwordResetToken,
				address,
				city,
				district,
				village,
			};

			const user = new User(userObj);
			const result = await user.save();

			// Send email verify account
			const token = jwt.sign({ _id: result._id }, JWT_KEY, {
				expiresIn: TOKEN_LIFE,
			});
			sendMail(req, result.email, token, 'confirmation');

			res.render('pages/auth', {
				respond: {
					msg: 'success',
					success: 'Đăng kí tài khoản thành công!',
				},
				data: '',
			});
		} catch (error) {
			console.log(error.message);
			let ret = {
				data: req.body,
				respond: {
					msg: 'ValidatorError',
				},
			};
			if (error.errors) {
				ret.respond.err = error.errors[Object.keys(error.errors)[0]].message;
			}

			console.log(ret);
			res.render('pages/auth', {
				...ret,
			});
		}
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * User sign in: local strategy
 */
module.exports.postSignIn = async (req, res, next) => {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}

		if (!user) {
			const respond = {
				msg: 'ValidatorError2',
				err: info[Object.keys(info)[0]],
			};

			return res.render('pages/auth', {
				respond,
				data: JSON.parse(JSON.stringify(req.body)),
			});
		}

		if (user.status) {
			req.logIn(user, async function (err) {
				if (err) {
					return next(err);
				}

				// Sync cart
				const cart = await mergeCart(Cart, req.user._id, req.session.cart);
				req.session.cart = cart;

				// Remember me
				if (req.body.remember && req.session.cookie) {
					req.session.cookie.maxAge = +REMEMBER_LIFE; // 7 days
				}
				res.redirect('/');
			});
		} else {
			res.redirect('/user/auth');
		}
	})(req, res, next);
};

/**
 * User sign out
 */
module.exports.postSignOut = (req, res, next) => {
	req.logOut();

	req.session.cart = null;
	req.user = null;

	res.redirect('/');
};

/**
 * Get user dashboard
 */
exports.getDashboard = async (req, res, next) => {
	const { user } = req;

	try {
		const checkout = await Checkout.find({ userId: user._id });

		res.render('pages/dashboard', {
			checkout,
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * Handle click confirm link on email
 */
module.exports.getConfirm = async (req, res, next) => {
	const { token } = req.params;

	try {
		const decoded = jwt.verify(token, JWT_KEY);
		const { _id } = decoded;

		const user = await User.findById(_id);

		user.isVerified = true;
		await User.updateOne({ _id }, { $set: user });

		res.render('pages/auth', {
			data: {},
			respond: {
				success2: 'Xác thực tài khoản thành công!',
				msg: 'success',
			},
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: 'Token has been expires!',
			error,
		});
	}
};

/**
 * Post request to the server for forgot password
 */
exports.postForgotPassword = async (req, res, next) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) throw new Error('Không tìm thấy tài khoản nào với email này!');

		// Send email
		const token = jwt.sign({ _id: user._id }, JWT_KEY, {
			expiresIn: TOKEN_LIFE,
		});
		user.passwordResetToken = token;
		user.passwordResetExpires = Date.now() + 5 * 60 * 1000; // 5h for token reset expires

		sendMail(req, email, token, 'recovery');

		await User.updateOne({ _id: user._id }, { $set: user });

		res.render('pages/email', {
			msg: 'success',
			email,
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * Handle click forgot link on email
 */
exports.getResetPassword = async (req, res, next) => {
	const { token } = req.params;

	try {
		const decoded = jwt.verify(token, JWT_KEY);
		const { _id } = decoded;

		const user = await User.findOne({
			_id,
			passwordResetToken: token,
			passwordResetExpires: {
				$gt: Date.now(),
			},
		});

		if (!user) throw new Error('User not found!');

		res.render('pages/forgot', {
			respond: {
				msg: 'success',
				success: 'Nhập mật khẩu mới!',
				token,
			},
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * User send the new update password
 */
exports.postResetPassword = async (req, res, next) => {
	const { token } = req.query;
	const { password, retypePassword } = req.body;

	try {
		const decoded = jwt.verify(token, JWT_KEY);
		const { _id } = decoded;

		const user = await User.findById(_id);

		if (!user) throw new Error('User not found!');

		// Validate
		if (password.length < 6)
			return res.render('pages/forgot', {
				data: req.body,
				respond: {
					msg: 'ValidatorError',
					passVal: password,
					password: 'Chiều dài mật khẩu tối thiểu là 6!',
					token,
				},
			});

		if (password.length > 20)
			return res.render('pages/forgot', {
				respond: {
					msg: 'ValidatorError',
					passVal: password,
					password: 'Chiều dài mật khẩu tối đa là 20!',
					token,
				},
			});

		if (password !== retypePassword)
			return res.render('pages/forgot', {
				respond: {
					msg: 'ValidatorError',
					passVal: password,
					retypePassword: 'Nhập lại mật khẩu không khớp!',
					token,
				},
			});

		// Update user password
		const encryptedPassword = await bcrypt.hash(password, 10);
		user.password = encryptedPassword;
		await User.updateOne({ _id: user._id }, { $set: user });

		res.render('pages/auth', {
			data: {},
			respond: {
				success2: 'Reset mật khẩu thành công!',
				msg: 'success',
			},
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * Get user wishlist
 */
exports.getWishlist = async (req, res, next) => {
	res.render('pages/wishlist', { user: req.user });
};

/*-------------------------- OAuth -------------------------*/

/**
 * Google OAuth
 */
exports.getGoogleCallback = (req, res, next) => {
	passport.authenticate('google', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.redirect('/user/auth');
		}
		req.logIn(user, async function (err) {
			if (err) {
				return next(err);
			}

			// Sync cart
			const cart = await mergeCart(Cart, user._id, req.session.cart);
			req.session.cart = cart;

			return res.redirect('/');
		});
	})(req, res, next);
};

/**
 * Facebook OAuth
 */
exports.getFacebookCallback = (req, res, next) => {
	passport.authenticate('facebook', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.redirect('/user/auth');
		}
		req.logIn(user, async function (err) {
			if (err) {
				return next(err);
			}

			// Sync cart
			const cart = await mergeCart(Cart, user._id, req.session.cart);
			req.session.cart = cart;

			return res.redirect('/');
		});
	})(req, res, next);
};
