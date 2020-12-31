const mongoose = require('mongoose');

const Product = require('./../../../models/product.model');

/**
 * Post a comment on product detail page
 */
module.exports.postComment = async (req, res, next) => {
	const { productSlugName } = req.params;
	const { name, email, review } = req.body;
	const { user } = req;

	try {
		const comment = {
			name,
			email,
			review,
			date: new Date(),
		};

		if (!user) {
			comment.userId = mongoose.Types.ObjectId();
		} else {
			comment.userId = user._id;
		}

		await Product.updateOne(
			{ slugName: productSlugName },
			{
				$push: {
					comments: comment,
				},
			}
		);

		res.status(201).json({
			msg: 'success',
			user: `Your comment has been public!`,
			data: comment,
		});
	} catch (error) {
		console.log(error);
		res.status(205).json({
			msg: 'ValidatorError',
			user: error.message,
		});
	}
};
