const mongoose = require("mongoose");

const userName = process.env.ATLAS_USERNAME;
const password = process.env.ATLAS_PASSWORD;
const dbName = process.env.DB_NAME;

const URI = `mongodb+srv://${userName}:${password}@web-shopping.dh41w.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("DB connected!");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
