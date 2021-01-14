const Village = require('./../../models/decentralization/village.model');

module.exports.getAllVillagesOfDistrict = (code) => {
	return Village.find({
		parent_code: code,
	}).sort({ name_with_type: 'asc' });
};
