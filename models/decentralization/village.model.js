const mongoose = require('mongoose');

const villageSchema = mongoose.Schema({
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
villageSchema.set('timestamps', true);

module.exports = mongoose.model('Village', villageSchema);
