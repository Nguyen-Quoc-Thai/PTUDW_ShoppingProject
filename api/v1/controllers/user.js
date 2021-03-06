const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Services
const UserServices = require('./../../../services/user.service');

// Services
const ProductServices = require('./../../../services/product.service');

// Service
const {
	getAllDistrictsOfProvince,
} = require('./../../../services/decentralization/district.service');
const {
	getAllVillagesOfDistrict,
} = require('./../../../services/decentralization/village.service');

// Cloud uploader
const cloudinary = require('./../../../config/cloudinary');

/**
 * Change password
 */
exports.putUpdatePassword = async (req, res, next) => {
	const { user } = req;
	const { oldPassword, password, retypePassword } = req.body;

	try {
		const validOldPassword = await bcrypt.compare(oldPassword, user.password);
		if (!validOldPassword) {
			return res.status(200).json({
				msg: 'ValidatorError',
				user: 'Mật khẩu hiện tại không đúng!',
			});
		}

		if (password !== retypePassword) {
			return res.status(200).json({
				msg: 'ValidatorError',
				user: 'Nhập lại mật khẩu không đúng!',
			});
		}

		// Change password
		const encryptedPassword = await bcrypt.hash(password, 10);
		const passwordResetToken = crypto.randomBytes(16).toString('hex');

		user.password = encryptedPassword;
		user.passwordResetToken = passwordResetToken;

		await UserServices.updateOne({ _id: user._id }, { $set: user });

		res.status(200).json({
			msg: 'success',
			user: 'Cập nhật mật khẩu mới thành công!',
			data: user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: error.message,
			error,
		});
	}
};

/**
 * Update user info
 */
exports.putUpdateInfo = async (req, res, next) => {
	const { user, body } = req;

	try {
		for (const fie in body) {
			if (!['phone', 'email', 'undefined'].includes(fie)) {
				user[fie] = body[fie];
			}
		}

		// Avatar upload/change
		if (req.file) {
			const ret = await cloudinary.uploadSingleAvatar(req.file.path);
			if (ret) {
				await cloudinary.destroySingle(user.cloudinary_id);
				user.avatar = ret.url;
				user.cloudinary_id = ret.id;
			}
		}

		// If user phone number is default value -> only change one time
		if (user.phone === '0987654321') user.phone = req.body.phone;
		await UserServices.updateOne({ _id: user._id }, { $set: user });

		res.status(200).json({
			msg: 'success',
			user: 'Cập nhật thông tin thành công!',
			data: user,
		});
	} catch (error) {
		let respond = {};
		error.errors &&
			Object.keys(error.errors).forEach(
				(err) => (respond[err] = error.errors[err].message)
			);

		res.status(200).json({
			msg: 'ValidatorError',
			errors: respond,
		});
	}
};

/**
 * Add to wishlist
 */
module.exports.postLike = async (req, res, next) => {
	const { productSlugName } = req.params;
	const { user } = req;

	try {
		const product = await ProductServices.findOne({
			slugName: productSlugName,
		});
		if (!product) {
			return res.status(200).json({
				msg: 'ValidatorError',
				user: 'Không tìm thấy sản phẩm!',
			});
		}

		const { name, slugName, price, images } = product;

		const like = {
			name,
			slugName,
			price,
			images,
			date: new Date(),
		};

		user.likes.push(like);
		await UserServices.updateOne(
			{ _id: user._id },
			{
				$set: user,
			}
		);

		res.status(201).json({
			msg: 'success',
			user: `Your like has been public!`,
			data: like,
		});
	} catch (error) {
		console.log(error);
		res.status(205).json({
			msg: 'ValidatorError',
			user: error.message,
			error,
		});
	}
};

/**
 * Delete a product from wishlist
 */
module.exports.postUnLike = async (req, res, next) => {
	const { productSlugName } = req.params;
	let { user } = req;

	try {
		user.likes = user.likes.filter((ele) => ele.slugName != productSlugName);
		await UserServices.updateOne({ _id: user._id }, { $set: user });

		req.user = user;
		res.status(201).json({
			msg: 'success',
			user: `Your delete has been execute!`,
			data: user.likes,
		});
	} catch (error) {
		console.log(error);
		res.status(205).json({
			msg: 'ValidatorError',
			user: error.message,
			error,
		});
	}
};

/** -------------------- Validator ----------------------- */

/**
 * Onblur form signup -> check valid value
 */
module.exports.postCheckExist = async (req, res, next) => {
	const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const phoneRegex = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

	try {
		const key = Object.keys(req.body)[0];

		let respond = {
			msg: 'success',
		};

		switch (key) {
			case 'email': {
				const userWithEmail = await UserServices.findOne({
					email: req.body[key],
				});
				if (userWithEmail) {
					respond.email = 'Địa chỉ email đã có người sử dụng!';
				}
				if (!req.body[key].match(emailRegex)) {
					respond.email = 'Email không hợp lệ!';
				}

				break;
			}
			case 'phone': {
				const userWithPhone = await UserServices.findOne({
					phone: req.body[key],
				});
				if (userWithPhone) {
					respond.phone = 'Số điện thoại đã có người sử dụng!';
				}
				if (!req.body[key].match(phoneRegex)) {
					respond.phone = 'Số điện thoại không hợp lệ!';
				}

				break;
			}
			case 'password': {
				if (req.body[key].length < 6) {
					respond.password = 'Độ dài mật khẩu tối thiểu là 6!';
				} else if (req.body[key].length > 20) {
					respond.password = 'Độ dài mật khẩu tối đa là 20!';
				}

				break;
			}
		}

		// If error found
		if (Object.keys(respond).length > 1) {
			respond.msg = 'error';
		}

		res.status(200).json(respond);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: error.message,
			error,
		});
	}
};

/**
 * Dynamic select option
 * On province changes
 */
module.exports.getDistrict = async (req, res, next) => {
	const { code } = req.params;

	try {
		const districts = await getAllDistrictsOfProvince(code);

		res.status(200).json({
			msg: 'success',
			data: districts,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: error.message,
			error,
		});
	}
};

/**
 * Dynamic select option
 * On district changes
 */
module.exports.getVillage = async (req, res, next) => {
	const { code } = req.params;

	try {
		const villages = await getAllVillagesOfDistrict(code);

		res.status(200).json({
			msg: 'success',
			data: villages,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: error.message,
			error,
		});
	}
};
