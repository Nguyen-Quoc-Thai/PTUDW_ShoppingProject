// const RedisClient = require("./../config/redis");
// const CACHE_LIFE = process.env.CACHE_LIFE;

const slug = require('slug');

const Product = require('../models/product.model');

// Utils func
const { allCategory } = require('./../utils/constant');
const { statistic, parsePrice } = require('./../utils/statistic');

/**
 * Global search on all categories
 * Query string: q, sort, min, max
 * Pagination: page, item_per_page
 */
module.exports.getSearch = async (req, res, next) => {
	// Page
	const page = parseInt(req.query.page) || 1;

	// Query string
	const { q = '' } = req.query;
	const item_per_page = parseInt(req.query.item_per_page) || 12;
	const { sort, min = 0, max = 100000000 } = req.query;

	try {
		// Search on slug
		const searchSlug = slug(q);
		const regex = new RegExp(searchSlug, 'i');

		let result = await Product.find({ slugName: regex });

		// Filter price
		result = result.filter(
			(product) =>
				parsePrice(product.price) >= min && parsePrice(product.price) < max
		);

		// Sort option
		if (sort && sort === 'asc') {
			result = result.sort((a, b) => {
				return parsePrice(a.price) - parsePrice(b.price);
			});
		} else if (sort && sort === 'desc') {
			result = result.sort((a, b) => {
				return -parsePrice(a.price) + parsePrice(b.price);
			});
		}

		// Pagination
		if (page < 1) page = 1;

		const len = result.length;

		// Page split
		result = result.slice(
			(page - 1) * item_per_page,
			item_per_page + (page - 1) * item_per_page
		);

		const request = {};
		request.currentPage = page;
		request.totalPages = Math.ceil(len / item_per_page);

		// Previous page
		if (page > 1) {
			request.previous = {
				page: page - 1,
				limit: item_per_page,
			};
		}

		// Next page
		if (page * item_per_page < len) {
			request.next = {
				page: page + 1,
				limit: item_per_page,
			};
		}

		const respond = {
			type: 'global',
			msg: 'success',
			request,
		};

		// Our brands: statistic products on producer
		const statisticPerType = await statistic(Product, { type: '' }, 'producer');
		if (statisticPerType.length > 9) statisticPerType.length = 9;

		res.locals.sort = sort || '';
		res.locals.query = q || '';
		res.locals.min = min || 0;
		res.locals.max = max || 100000000;
		res.locals.ourBrands = statisticPerType || null;

		res.render('pages/products', {
			msg: 'success',
			data: result || null,
			respond,
		});

		// Caching
		// const key = q + page + item_per_page + sort + min + max;
		// RedisClient.setex(
		//   key,
		//   CACHE_LIFE,
		//   JSON.stringify({
		//     data: result || null,
		//     ourBrands: statisticPerType || null,
		//     respond,
		//   })
		// );
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * Get products of 1 category
 * Query string: producer, search, sort, min, max
 * Pagination: page, item_per_page
 */
module.exports.getResourceProducts = async (req, res, next) => {
	// Category type
	const { resourceSlugName } = req.params;

	// Query string
	const { producer } = req.query;
	const { search = '', sort, min = 0, max = 100000000 } = req.query;
	const page = parseInt(req.query.page) || 1;
	const item_per_page = parseInt(req.query.item_per_page) || 12;

	const validResourceSlugName = allCategory.map((cate) => cate.slugName);

	try {
		if (!validResourceSlugName.includes(resourceSlugName)) {
			throw new Error('Invalid url!');
		}

		let mapValue = allCategory.find(
			(cate) => cate.slugName === resourceSlugName
		);

		// Search
		const objQuery = {
			type: mapValue.name,
		};

		const searchSlug = slug(search);
		const regex = new RegExp(searchSlug, 'i');
		objQuery.slugName = regex;

		if (producer) {
			objQuery['producer'] = producer;
		}

		let result = await Product.find(objQuery);

		// Filter price
		result = result.filter(
			(product) =>
				parsePrice(product.price) >= min && parsePrice(product.price) < max
		);

		// Sort
		if (sort && sort === 'asc') {
			result = result.sort((a, b) => {
				return parsePrice(a.price) - parsePrice(b.price);
			});
		} else if (sort && sort === 'desc') {
			result = result.sort((a, b) => {
				return -parsePrice(a.price) + parsePrice(b.price);
			});
		}

		// Pagination
		if (page < 1) page = 1;

		const len = result.length;

		result = result.slice(
			(page - 1) * item_per_page,
			item_per_page + (page - 1) * item_per_page
		);

		const request = {};
		request.currentPage = page;
		request.totalPages = Math.ceil(len / item_per_page);

		// Previous page
		if (page > 1) {
			request.previous = {
				page: page - 1,
				limit: item_per_page,
			};
		}

		// Next page
		if (page * item_per_page < len) {
			request.next = {
				page: page + 1,
				limit: item_per_page,
			};
		}

		const respond = {
			msg: 'success',
			request,
		};

		// Statistic products of the category on producer
		const statisticPerType = await statistic(
			Product,
			{ type: mapValue.name },
			'producer'
		);
		if (statisticPerType.length > 9) statisticPerType.length = 9;

		res.locals.sort = sort || '';
		res.locals.query = search || '';
		res.locals.min = min || 0;
		res.locals.max = max || 100000000;
		res.locals.ourBrands = statisticPerType || null;

		res.render('pages/products', {
			msg: 'success',
			data: result || null,
			respond,
		});

		// Caching
		// const key =
		// 	resourceSlugName +
		// 	producer +
		// 	page +
		// 	item_per_page +
		// 	search +
		// 	sort +
		// 	min +
		// 	max;
		// RedisClient.setex(
		//   key,
		//   CACHE_LIFE,
		//   JSON.stringify({
		//     data: result || null,
		//     ourBrands: statisticPerType || null,
		//     respond,
		//   })
		// );
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};

/**
 * View product info
 */
module.exports.getProductDetails = async (req, res, next) => {
	const { productSlugName } = req.params;

	try {
		const product = await Product.findOne({
			slugName: productSlugName,
		});

		// Get relative products
		const { type, producer } = product;
		const relativeProducts = await Product.find({
			type,
			producer,
		}).limit(8);

		const statisticPerType = await statistic(Product, { type }, 'producer');
		if (statisticPerType.length > 9) statisticPerType.length = 9;

		res.locals.ourBrands = statisticPerType || null;

		// Update view count
		product.countView++;
		await product.save();

		res.render('pages/productDetail', {
			msg: 'success',
			data: product || null,
			relatedProducts: relativeProducts || null,
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			message: error.message,
			error,
		});
	}
};
