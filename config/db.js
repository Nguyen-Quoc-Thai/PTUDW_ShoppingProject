const mongoose = require('mongoose');

const ATLAS_USERNAME = process.env.ATLAS_USERNAME;
const ATLAS_PASSWORD = process.env.ATLAS_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Connection string
const URI = `mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@web-shopping.dh41w.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
	try {
		await mongoose.connect(URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		console.log('DB connected!');
	} catch (err) {
		console.log(err.message);
	}
};

module.exports = connectDB;
