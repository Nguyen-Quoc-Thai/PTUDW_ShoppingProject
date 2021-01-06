const Checkout = require('./../models/checkout.model');

module.exports.find = (obj_filter) => {
	return Checkout.find(obj_filter);
};

module.exports.findById = (obj_filter) => {
	return Checkout.findById(obj_filter);
};

module.exports.new = (obj_attr) => {
	return new Checkout(obj_attr);
};
