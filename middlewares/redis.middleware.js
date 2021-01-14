const RedisClient = require('./../config/redis');

/**
 * Home page cache (data only)
 */
module.exports.homeCache = (req, res, next) => {
	console.log('Cache key:' + '/');

	RedisClient.get('/', (error, data) => {
		if (error) {
			console.log(error);
			return res.render('error', {
				message: error.message,
				error,
			});
		}

		if (data != null) {
			console.log('Cache hit!');
			res.render('pages/index', {
				msg: 'success',
				data: JSON.parse(data) || [],
			});
		} else {
			console.log('Cache miss!');
			next();
		}
	});
};

/**
 * Global search cache (data)
 */
module.exports.searchCache = (req, res, next) => {
	// Query string
	const { q = '' } = req.query;
	const page = parseInt(req.query.page) || 1;
	const item_per_page = parseInt(req.query.item_per_page) || 12;
	const { sort = 'asc', min = 0, max = 100000000 } = req.query;

	if (page < 1) page = 1;

	// Cache key
	const key = q + page + item_per_page + sort + min + max;
	console.log('Cache key:' + key);

	RedisClient.get(key, (error, data) => {
		if (error) {
			console.log(error);
			return res.render('error', {
				message: error.message,
				error,
			});
		}

		if (data != null) {
			console.log('Cache hit!');
			res.render('pages/products', {
				msg: 'ValidatorError',
				min,
				max,
				sort,
				query: q,
				...JSON.parse(data),
			});
		} else {
			console.log('Cache miss!');
			next();
		}
	});
};

/**
 * Cache on category
 */
module.exports.resourceCache = (req, res, next) => {
	const { resourceSlugName } = req.params;

	// Query string
	const { producer } = req.query;
	const { search = '', sort = 'asc', min = 0, max = 100000000 } = req.query;
	const page = parseInt(req.query.page) || 1;
	const item_per_page = parseInt(req.query.item_per_page) || 12;

	if (page < 1) page = 1;

	// Cache key
	const key =
		'' +
		resourceSlugName +
		producer +
		page +
		item_per_page +
		search +
		sort +
		min +
		max;
	console.log('Cache key:' + key);

	RedisClient.get(key, (error, data) => {
		if (error) {
			console.log(error);
			return res.render('error', {
				message: error.message,
				error,
			});
		}

		if (data != null) {
			console.log('Cache hit!');
			res.render('pages/products', {
				msg: 'ValidatorError',
				min,
				max,
				query: search || '',
				sort,
				...JSON.parse(data),
			});
		} else {
			console.log('Cache miss!');
			next();
		}
	});
};
