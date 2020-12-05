const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const slug = require("slug");
const passport = require("passport");

const User = require("./../models/user.model");
const Cart = require("./../models/cart.model");

const { sendMail } = require("./../config/nodemailer");
const { mergeCart } = require("./../utils/statistic");

const tokenLife = process.env.TOKEN_LIFE;
const jwtKey = process.env.JWT_KEY;

// module.exports.getDashboard = (req, res) => {
//   res.render("pages/dashboard");
// };

// module.exports.getWishlist = (req, res) => {
//   res.render("pages/wishlist");
// };

// module.exports.getCheckout = (req, res) => {
//   res.render("pages/checkout");
// };

// module.exports.getAuth = (req, res) => {
//   res.render("pages/auth");
// };

module.exports.getAuth = (req, res, next) => {
  console.log(req.app.locals.cart);
  res.render("pages/auth", {
    msg: "success",
    respond: "",
    data: "",
  });
};

module.exports.postSignUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    retypePassword,
  } = req.body;

  console.log(req.body);

  try {
    if (password !== retypePassword)
      return res.render("pages/auth", {
        data: req.body,
        respond: {
          msg: "ValidatorError",
          retypePassword: "Password retype does not match!",
        },
      });

    if (password.length < 6)
      return res.render("pages/auth", {
        data: req.body,
        respond: {
          msg: "ValidatorError",
          password: "Password length must be greater than 6!",
        },
      });

    if (password.length > 20)
      return res.render("pages/auth", {
        data: req.body,
        respond: {
          msg: "ValidatorError",
          password: "Password length must be lesser than 20!",
        },
      });

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

    res.render("pages/auth", {
      respond: {
        msg: "success",
        success: "Sign up successful!",
      },
      data: "",
    });
  } catch (error) {
    let respond = { msg: "ValidatorError" };
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );

    res.render("pages/auth", { respond, data: req.body });
  }
};

module.exports.postSignIn = async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      const respond = {
        msg: "ValidatorError2",
        [Object.keys(info)[0]]: info[Object.keys(info)[0]],
      };

      return res.render("pages/auth", {
        respond,
        data: JSON.parse(JSON.stringify(req.body)),
      });
    }

    if (!user.isVerified) {
      return res.render("pages/auth", {
        // render page co nut resend email confirm acc
        respond: {
          msg: "ValidatorError2",
          user: "Your account has not been verified!",
        },
        data: req.body,
      });
    }

    if (user.status) {
      req.logIn(user, async function (err) {
        if (err) {
          return next(err);
        }

        const cart = await mergeCart(Cart, req.user._id, req.session.cart);
        req.session.cart = cart;
        res.redirect("back");
      });
    } else {
      res.render("pages/auth", {
        respond: {
          msg: "ValidatorError2",
          user: "Your account has been blocked!",
        },
        data: req.body,
      });
    }
  })(req, res, next);
};

module.exports.postSignOut = (req, res, next) => {
  req.logout();
  req.session.cart = null;
  req.user = null;
  res.redirect("back");
};

module.exports.getConfirm = async (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, jwtKey);
    const { _id } = decoded;

    const user = await User.findById(_id);

    user.isVerified = true;
    await User.updateOne({ _id }, { $set: user });

    res.render("pages/auth", {
      data: {},
      respond: {
        success2: "Your account has been verified!",
        msg: "success",
      },
    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      message: "Token has been expires!",
      error,
    });
  }
};

exports.getDashboard = async (req, res, next) => {
  res.render("pages/dashboard");
};

exports.putUpdatePassword = async (req, res, next) => {
  const { user } = req;
  console.log(req.body);

  try {
    const { oldPassword, password, retypePassword } = req.body;

    const validOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validOldPassword) {
      return res.status(200).json({
        msg: "ValidatorError",
        user: "Old password invalid!",
      });
    }

    if (password !== retypePassword) {
      return res.status(200).json({
        msg: "ValidatorError",
        user: "Password and retype password does not match!",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const passwordResetToken = crypto.randomBytes(16).toString("hex");

    user.password = encryptedPassword;
    user.passwordResetToken = passwordResetToken;

    await User.updateOne({ _id: user._id }, { $set: user });

    res.status(200).json({
      msg: "success",
      user: "Your password has been updated!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error.message,
      error,
    });
  }
};

exports.putUpdateInfo = async (req, res, next) => {
  const { user } = req;
  const { body } = req;

  try {
    for (const fie in body) {
      if (fie !== "undefined") {
        user[fie] = body[fie];
      }
    }
    await User.updateOne({ _id: user._id }, { $set: body });

    res.status(200).json({
      msg: "success",
      user: "Your information has been updated!",
      data: user,
    });
  } catch (error) {
    let respond = {};
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );

    res.status(200).json({
      msg: "ValidatorError",
      errors: respond,
    });
  }
};

//

module.exports.getAll = (req, res, next) => {
  const { user } = req;

  if (user.role != "admin") {
    return res.render("pages/admin", {
      msg: "ValidatorError",
      user: `You don't have the permission!`,
      data: user,
    });
  }

  const page = parseInt(req.query.page) || 1;
  const items_per_page = parseInt(req.query.limit) || 100;

  if (page < 1) page = 1;

  User.find({})
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async (users) => {
      const request = {};
      const len = await User.find({}).count();

      request.currentPage = page;
      request.totalPages = Math.ceil(len / items_per_page);

      if (page > 1) {
        request.previous = {
          page: page - 1,
          limit: items_per_page,
        };
      }

      if (page * items_per_page < len) {
        request.next = {
          page: page + 1,
          limit: items_per_page,
        };
      }

      const respond = {
        msg: "success",
        user: "Fetch successful!",
        data: users,
      };

      res.render("pages/auth", respond);
    })
    .catch((error) => {
      console.log(error);
      res.render("pages/auth", {
        msg: "ValidatorError",
        user: error.message,
      });
    });
};

module.exports.getOne = (req, res, next) => {
  const _id = req.params.userId;

  let selectStr = "";

  if (_id === req.user._id)
    selectStr =
      "firstName lastName email phone avatar isVerified like address password";
  else selectStr = "firstName lastName email phone avatar";

  User.findById(_id)
    .select(selectStr)
    .then((user) => {
      if (!user) {
        res.render("pages/auth", {
          msg: "ValidatorError",
          user: `User not found!`,
        });
      } else {
        res.render("pages/info", {
          msg: "success",
          user: `Fetch successful!`,
          data: user,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.render("pages/auth", {
        msg: "ValidatorError",
        user: error.message,
      });
    });
};

// AJAX
module.exports.deleteOne = async (req, res, next) => {
  const { id: _id } = req.params;
  const { user } = req;

  try {
    if (user.role !== "admin")
      throw new Error(`You don't have the permission!`);

    const result = await User.deleteOne({ _id });
    const respond = await User.find();

    res.status(200).json({
      msg: "success",
      user: "Delete user successful!",
      data: respond,
    });
  } catch (error) {
    console.log(error);
    res.status(205).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
};

// AJAX
module.exports.postToggleBlock = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found!");
    if (user.role != "admin") throw new Error(`You don't have the permission!`);
    if (req.user._id === userId)
      throw new Error(`Unable to active/disable self account!`);

    user.status = !user.status;
    await User.updateOne({ _id: userId }, { $set: user });

    res.render("pages/admin", {
      msg: "success",
      user: `Update success: ${user.status}!`,
    });
  } catch (error) {
    console.log(error);
    res.status(205).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
};
