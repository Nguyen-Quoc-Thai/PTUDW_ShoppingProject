// const RedisClient = require("./../config/redis");
// const CACHE_LIFE = process.env.CACHE_LIFE;

// Services
const ProductServices = require('./../services/product.service');

// Utils func
const { allCategory } = require('./../utils/constant');

/**
 * Home page
 * Select default tops of each category or Samples of those
 */
module.exports.index = async (req, res, next) => {
	try {
		const resultPromise = Promise.all(
			allCategory.map(async (cate) => {
				// Tops of product collection
				const ret = await ProductServices.find({
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

		// RedisClient.setex("/", CACHE_LIFE, JSON.stringify(result));
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};
