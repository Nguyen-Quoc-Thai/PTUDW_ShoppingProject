const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const slug = require("slug");
const passport = require("passport");

const User = require("./../models/user.model");
const Cart = require("./../models/cart.model");
const Checkout = require("./../models/checkout.model");

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
  const { user } = req;

  try {
    const checkout = await Checkout.find({ userId: user._id });

    res.render("pages/dashboard", {
      checkout,
    });
  } catch (error) {
    console.log(error.message);
    res.render("error", {
      message: error.message,
      error,
    });
  }
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

exports.postForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        msg: "ValidatorError",
        user: "User not found!",
      });

    const token = jwt.sign({ _id: user._id }, jwtKey, {
      expiresIn: tokenLife,
    });
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 5 * 60 * 1000; // 5h

    await User.updateOne({ _id: user._id }, { $set: user });
    sendMail(req, email, token, "recovery");

    res.status(200).json({
      msg: "success",
      user: "Reset password email has been sent!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error.message,
      error,
    });
  }
};

exports.getResetPassword = async (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, jwtKey);
    const { _id } = decoded;

    const user = await User.findOne({
      _id,
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    res.render("pages/forgot", {
      respond: {
        msg: "success",
        success: "Type your new password!",
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.render("pages/forgot", {
      respond: {
        msg: "ValidatorError",
        user: error.message,
        token,
      },
    });
  }
};

exports.postResetPassword = async (req, res, next) => {
  const { token } = req.query;
  const { password, retypePassword } = req.body;

  try {
    const decoded = jwt.verify(token, jwtKey);
    const { _id } = decoded;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found!");
    }

    if (password !== retypePassword) {
      return res.render("pages/forgot", {
        respond: {
          msg: "ValidatorError",
          passVal: password,
          retypePassword: "Retype password does not match!",
        },
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;

    await User.updateOne({ _id: user._id }, { $set: user });

    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.render("pages/forgot", {
      respond: {
        msg: "ValidatorError",
        user: error.message,
        token,
      },
    });
  }
};

exports.postResend = async (req, res, next) => {
  // cai nay can 1 cai nut resend la dc ui
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.render("pages/auth", {
        // render page signup success
        msg: "ValidatorError",
        user: "Email not found!",
      });

    if (user.isVerified)
      return res.render("pages/auth", {
        // render page signup success
        msg: "success",
        user: "Your account has been verified!",
      });

    const token = jwt.sign({ _id: user._id }, jwtKey, {
      expiresIn: tokenLife,
    });
    sendMail(req, user.email, token, "confirmation");

    user.msg = "success";
    console.log(user);
    res.render("pages/auth", {
      msg: "success",
      user: `Recovery email has been sent to ${email}!`,
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: error.message,
    });
  }
};

module.exports.getRecovery = (req, res, next) => {
  res.render("pages/recovery"); // render page 1 field nhap email
};

module.exports.postRecovery = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.render("pages/auth", {
        msg: "ValidatorError",
        user: "Email not found!",
      });

    const token = jwt.sign({ _id: user._id }, jwtKey, {
      expiresIn: tokenLife,
    });
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 5 * 60 * 1000; // 5h

    await User.updateOne({ _id: user._id }, { $set: user });
    sendMail(req, email, token, "recovery");

    res.render("pages/auth", {
      mag: "success",
      user: `Recovery email has been sent to ${email}!`,
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: error.message,
    });
  }
};

module.exports.getReset = async (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, jwtKey);
    const { _id } = decoded;

    const user = await User.findOne({
      _id,
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.render("pages/auth", {
        // render page 404
        msg: "ValidatorError",
        user: "Token invalid!",
      });
    }

    res.render("pages/auth", {
      // render page nhap 2 field password va retypePassword
      msg: "success",
      user: "Type your new password!",
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      // render page 404
      msg: "ValidatorError",
      user: error.message,
    });
  }
};

module.exports.postReset = async (req, res, next) => {
  const { password, retypePassword } = req.body;

  try {
    const decoded = jwt.verify(token, jwtKey);
    const { _id } = decoded;

    const user = await User.findOne({
      _id,
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.render("pages/auth", {
        // render page 404
        msg: "ValidatorError",
        user: "Token failed. Invalid url!",
      });
    }

    if (password !== retypePassword) {
      return res.render("pages/auth", {
        // render page get reset password
        msg: "ValidatorError",
        user: "Passwords does not match!",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const passwordResetToken = crypto.randomBytes(16).toString("hex");

    user.password = encryptedPassword;
    user.passwordResetToken = passwordResetToken;

    const newUser = await User.updateOne({ _id }, { $set: user });

    res.render("pages/auth", {
      msg: "success",
      user: "Reset password success!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      // render page 404
      msg: "ValidatorError",
      user: error.message,
    });
  }
};

module.exports.getInfo = (req, res, next) => {
  const { user } = req;

  try {
    if (!user) {
      return res.render("pages/auth", {
        msg: "ValidatorError",
        user: "Please login to get information!",
      });
    }

    res.render("pages/auth", {
      // page info
      msg: "success",
      user: "Get information successful!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: error.message,
    });
  }
};

module.exports.patchUpdate = async (req, res, next) => {
  const acceptUserFields = [
    "firstName",
    "lastName",
    "phone",
    "address",
    "password",
  ];

  const { id } = req.params;
  const { user } = req;
  const keys = Object.keys(req.body);
  let hasPassword = false;
  let newUser = {};

  try {
    for (const ops of keys) {
      if (acceptUserFields.includes(ops)) {
        newUser[ops] = req.body.ops;
      } else {
        return res.render("pages/auth", {
          // render page info
          msg: "ValidatorError",
          user:
            "You are only allowed to change the {firstName}, {lastName}, {phone}, {address}, {password}!",
          data: user,
        });
      }

      if (ops === "password") {
        hasPassword = true;
      }
    }

    if (hasPassword) {
      if (!newUser.oldPassword)
        return res.render("pages/auth", {
          // render page info
          msg: "ValidatorError",
          user: "Old password is required!",
          data: user,
        });
      else {
        const isMatched = bcrypt.compare(newUser.oldPassword, user.password);
        if (!isMatched)
          return res.render("pages/auth", {
            // render page info
            msg: "ValidatorError",
            user: "Old password is invalid!",
            data: user,
          });
      }
    }

    if (hasPassword && !newUser.retypePassword) {
      return res.render("pages/auth", {
        // render page info
        msg: "ValidatorError",
        user: "Retypepassword is required!",
        data: user,
      });
    }

    if (
      hasPassword &&
      newUser.retypePassword &&
      newUser.password !== newUser.retypePassword
    ) {
      return res.render("pages/auth", {
        // render page info
        msg: "ValidatorError",
        user: "Password and retypepassword does not match!",
        data: user,
      });
    }

    if (hasPassword) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      user.password = encryptedPassword;
    }

    const result = await User.updateOne(
      { _id: id },
      { $set: user },
      { runValidators: true }
    );
    if (!result) {
      return res.render("pages/auth", {
        // render page info
        msg: "ValidatorError",
        user: "Phone number already exist!",
        data: user,
      });
    }

    res.render("pages/auth", {
      msg: "success",
      user: "Info updated!",
      data: result,
    });
  } catch (error) {
    console.log(error),
      res.render("pages/auth", {
        msg: "ValidatorError",
        user: error.message,
        data: user,
      });
  }
};

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
