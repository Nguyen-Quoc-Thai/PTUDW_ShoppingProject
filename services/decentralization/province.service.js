const Province = require('./../../models/decentralization/province.model');

module.exports.getAllProvinces = () => {
	return Province.find().sort({ name_with_type: 'asc' });
};
