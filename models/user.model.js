const mongoose = require('mongoose');

// Utils func
const { randomPassword } = require('./../utils/passport');

const enumUser = {
	values: ['user', 'admin'],
	message: `Quyền người dùng phải là 'user' or 'admin'!`,
};

const enumStatus = {
	values: ['active', 'disable'],
	message: `Trạng thái phải là 'active' or 'disable'!`,
};

const userScheme = mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'Họ là bắt buộc!'],
	},
	lastName: {
		type: String,
		required: [true, 'Tên là bắt buộc!'],
	},
	email: {
		type: String,
		required: [true, 'Địa chỉ email là bắt buộc!'],
		unique: true,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Định dạng email không đúng!',
		],
	},
	phone: {
		type: String,
		default: '0987654321',
		match: [
			/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
			'Số điện thoại không đúng!',
		],
	},
	roles: {
		type: String,
		enum: enumUser,
		default: 'user',
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		enum: enumStatus,
		default: 'active',
	},
	cash: {
		type: Number,
		default: 0,
	},
	address: {
		type: String,
		default: '',
	},
	city: {
		type: String,
		default: '',
	},
	district: {
		type: String,
		default: '',
	},
	village: {
		type: String,
		default: '',
	},
	avatar: {
		type: String,
		default: '',
	},
	likes: {
		type: Array,
		default: [],
	},
	password: {
		type: String,
		default: randomPassword(8),
	},
	passwordResetToken: {
		type: String,
		default: randomPassword(10),
	},
	passwordResetExpires: {
		type: Date,
		default: Date.now(),
	},
	slugName: {
		type: String,
	},
	cloudinary_id: {
		type: String,
		default: '',
	},
	google: {
		type: Object,
		default: {
			id: '',
			token: '',
		},
	},
	facebook: {
		type: Object,
		default: {
			id: '',
			token: '',
		},
	},
});

userScheme.path('email').validate(async (value) => {
	const emailCount = await mongoose.models.User.countDocuments({
		email: value,
	});
	return !emailCount;
}, 'Địa chỉ email đã có người sử dụng!');

// Add plugins
userScheme.set('timestamps', true);
module.exports = mongoose.model('User', userScheme);
