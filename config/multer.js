const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().split(/:/).join('-') + file.originalname);
	},
});

// Filter file support: jpg, jpeg, png
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/png'
	) {
		cb(null, true);
	} else {
		cb(new Error('Chỉ hỗ trợ các loại định dạng: jpg, jpeg, png!'), false);
	}
};

const upload = multer({
	storage,
	limits: 1024 * 1024 * 5, // 5 MB
	fileFilter,
});

module.exports = upload;
