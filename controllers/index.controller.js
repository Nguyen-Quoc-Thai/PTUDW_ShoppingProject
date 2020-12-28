// const RedisClient = require("./../config/redis");
const cache_life = process.env.CACHE_LIFE;

const Product = require('./../models/product.model');

const { allCategory } = require('./../utils/constant');

module.exports.index = async (req, res, next) => {
	try {
		const resultPromise = Promise.all(
			allCategory.map(async (cate) => {
				// Tops of product collection
				const ret = await Product.find({
					type: cate.name,
				}).limit(10);

				// Samples product collection
				// const ret = await Product.aggregate([
				//   { $match: { type: cate.name } },
				//   { $sample: { size: 10 } },
				// ]);

				return ret;
			})
		);

		const result = await resultPromise;

		res.render('pages/index', {
			msg: 'success',
			data: result || [],
		});

		// RedisClient.setex("/", cache_life, JSON.stringify(result));
	} catch (error) {
		res.render('error', {
			message: error.message,
			error,
		});
	}
};
