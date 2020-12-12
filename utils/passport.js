const bcrypt = require("bcrypt");

const User = require("./../models/user.model");

function randomID(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports.findUserByEmail = (email) => {
  return User.findOne({ email });
};

module.exports.findUserById = (id) => {
  return User.findById(id);
};

module.exports.randomPassword = (length) => {
  const randID = randomID(length);
  bcrypt.hash(randID, 10, (error, encrypted) => {
    if (error) throw new Error(error.message);
    return encrypted;
  });
};
