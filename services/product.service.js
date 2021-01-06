const Product = require('./../models/product.model');

module.exports.find = (obj_filter) => {
	return Product.find(obj_filter);
};

module.exports.findOne = (obj_filter) => {
	return Product.findOne(obj_filter);
};

module.exports.aggregate = (arr_filter) => {
	return Product.aggregate(arr_filter);
};

module.exports.updateOne = (obj_filter, obj_update) => {
	return Product.updateOne(obj_filter, obj_update);
};
