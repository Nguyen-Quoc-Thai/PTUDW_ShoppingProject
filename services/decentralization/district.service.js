const District = require('./../../models/decentralization/district.model');

module.exports.getAllDistrictsOfProvince = (code) => {
	return District.find({
		parent_code: code,
	}).sort({ name_with_type: 'asc' });
};
