const mongoose = require('mongoose');

const districtSchema = mongoose.Schema({
	name: {
		type: String,
	},
	type: {
		type: String,
	},
	slug: {
		type: String,
	},
	name_with_type: {
		type: String,
	},
	path: {
		type: String,
	},
	path_with_type: {
		type: String,
	},
	code: {
		type: String,
	},
	parent_code: {
		type: String,
	},
});

// Add plugins
districtSchema.set('timestamps', true);

module.exports = mongoose.model('District', districtSchema);
