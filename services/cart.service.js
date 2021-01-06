const Cart = require('./../models/cart.model');

module.exports.findOne = (obj_filter) => {
	return Cart.findOne(obj_filter);
};

module.exports.new = (obj_attr) => {
	return new Cart(obj_attr);
};
