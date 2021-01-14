const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

const productSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Tên người dùng là bắt buộc!'],
	},
	slugName: {
		type: String,
		slug: 'name',
	},
	code: {
		type: String,
		default: '',
	},
	rating: {
		type: Number,
		default: 5,
	},
	price: {
		type: String,
		required: [true, 'Giá sản phẩm là bắt buộc!'],
	},
	oldPrice: {
		type: String,
		slug: 'price',
	},
	type: {
		type: String,
		default: '',
	},
	images: {
		type: Array,
		default: [],
	},
	quantity: {
		default: '',
	},
	tags: {
		type: Array,
		default: [],
	},
	producer: {
		type: String,
		required: [true, 'Nhà sản xuất là bắt buộc!'],
	},
	video: {
		type: String,
		default: '',
	},
	countView: {
		type: Number,
		default: 0,
	},
	countLike: {
		type: Number,
		default: 0,
	},
	countRating: {
		type: Number,
		default: 0,
	},
	countSale: {
		type: Number,
		default: 0,
	},
	details: {},
	descriptions: [
		{
			title: {
				type: String,
				default: '',
			},
			content: {
				type: String,
				default: '',
			},
			img: {
				type: String,
				default: '',
			},
		},
	],
	comments: {
		type: Array,
		default: [],
	},
	promotion: {
		code: {
			type: String,
			default: '',
		},
		desc: {
			type: String,
			default: '',
		},
		link: {
			type: String,
			default: '',
		},
	},
});

// Add plugins
productSchema.set('timestamps', true);
mongoose.plugin(slug);

module.exports = mongoose.model('Product', productSchema);
