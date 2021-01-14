const User = require('./../models/user.model');

module.exports.findOne = (obj_filter) => {
	return User.findOne(obj_filter);
};

module.exports.findById = (id) => {
	return User.findById(id);
};

module.exports.new = (obj_attr = {}) => {
	return new User(obj_attr);
};

module.exports.updateOne = (obj_filter, obj_update) => {
	return User.updateOne(obj_filter, obj_update);
};
