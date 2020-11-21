const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const slug = require("slug");

const User = require("./../models/user.model");

const { sendMail } = require("./../config/nodemailer");

const tokenLife = process.env.TOKEN_LIFE;
const jwtKey = process.env.JWT_KEY;

module.exports.getDashboard = (req, res) => {
  res.render("pages/dashboard");
};

module.exports.getWishlist = (req, res) => {
  res.render("pages/wishlist");
};

module.exports.getCheckout = (req, res) => {
  res.render("pages/checkout");
};

module.exports.getAuth = (req, res) => {
  res.render("pages/auth");
};

module.exports.signUp = async (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const passwordResetToken = crypto.randomBytes(16).toString("hex");

    const userObj = {
      firstName,
      lastName,
      email,
      phone,
      slugName: slug(firstName + " " + lastName),
      password: encryptedPassword,
      passwordResetToken,
    };

    const user = new User(userObj);
    const result = await user.save();

    const token = jwt.sign({ _id: result._id }, jwtKey, {
      expiresIn: tokenLife,
    });
    sendMail(req, result.email, token, "confirmation");

    result.msg = "success";
    console.log(result);
    res.render("pages/auth", { result });
  } catch (error) {
    let respond = { msg: "ValidatorError" };
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );

    console.log(respond);
    res.render("pages/auth", { respond });
  }
};

module.exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) throw new Error("Email not found!");

    const isMatchedPassword = await bcrypt.compare(
      password,
      validUser.password
    );
    if (!isMatchedPassword) throw new Error("Password does not match!");

    validUser.msg = "success";
    console.log(validUser);
    res.render("pages/auth", { validUser });
  }
  catch (error) {
    let respond = { msg: "ValidatorError" };
    respond.error = error.message;
    console.log(respond);
    res.render("pages/auth", { respond });
  }
};
