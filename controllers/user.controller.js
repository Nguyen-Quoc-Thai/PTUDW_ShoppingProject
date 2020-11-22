const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const slug = require("slug");
const passport = require("passport");

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

    console.log(result);
    res.render("pages/auth", {
      msg: "success",
      user: "Sign up successful!",
      data: result,
    });
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
  // const { email, password } = req.body;

  // try {
  //   const validUser = await User.findOne({ email });
  //   if (!validUser) throw new Error("Email not found!");

  //   const isMatchedPassword = await bcrypt.compare(
  //     password,
  //     validUser.password
  //   );
  //   if (!isMatchedPassword) throw new Error("Password does not match!");

  //   validUser.msg = "success";
  //   console.log(validUser);
  //   res.render("pages/auth", { validUser });
  // } catch (error) {
  //   let respond = { msg: "ValidatorError" };
  //   respond[error.message.split(' ')[0].toLowerCase()] = error.message;
  //   console.log(respond);
  //   res.render("pages/auth", { respond });
  // }

  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      const respond = {
        msg: "ValidatorError",
        [Object.keys(info)[0]]: info[Object.keys(info)[0]],
      };
      console.log(respond);
      return res.render("pages/auth", respond);
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      console.log(user);
      return res.render("pages/dashboard", {
        msg: "success",
        user: "Sign in successful!",
        data: user,
      });
    });
  })(req, res, next);
};

module.exports.signOut = (req, res, next) => {
  req.logout();
  res.redirect("user/login");
};

module.exports.confirm = async (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, jwtKey);
    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user)
      return res.render("pages/auth", {
        msg: "ValidatorError",
        user: "User not found!",
      });

    if (user.isVerified)
      return res.render("pages/auth", {
        msg: "success",
        user: "Your account has been verified!",
      });

    user.isVerified = true;
    await User.updateOne({ _id }, { $set: user });

    console.log(user);
    res.render("pages/auth", {
      msg: "success",
      user: "Your account has been verified!",
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: "Saving update failed!",
    });
  }
};

exports.resend = async (req, res, next) => {
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
      user: "Resend email failed!",
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
      user: "Recovery failed!",
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
      user: "Reset password failed!",
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
        user: "Token invalid!",
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

    await User.updateOne({ _id }, { $set: user });

    res.render("pages/auth", {
      msg: "success",
      user: "Reset password success!",
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      // render page 404
      msg: "ValidatorError",
      user: "Reset password failed!",
    });
  }
};

// module.exports.getUpdate = (req, res, next) => {
//   res.render('pages/info') //   render page info insert san thong tin co ban va cho phep sua
// }

module.exports.postUpdate = async (req, res, next) => {
  const acceptUserFields = [
    "firstName",
    "lastName",
    "phone",
    "address",
    "password",
  ];

  const { user } = req;
  let hasPassword = false;
  let newUser = {};

  try {
    for (const ops of req.body) {
      if (acceptUserFields.includes(ops.propName)) {
        newUser[ops.propName] = ops.value;
      } else {
        return res.render("pages/info", {
          msg: "ValidatorError",
          user:
            "You are only allowed to change the {firstName}, {lastName}, {phone}, {address}, {password}!",
          data: user,
        });
      }

      if (ops.propName === "password") {
        hasPassword = true;
      }
    }

    if (hasPassword) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      user.password = encryptedPassword;
    }

    const result = await User.updateOne({ _id: user._id }, { $set: user });

    res.render("pages/info", {
      msg: "success",
      user: "Info updated!",
      data: result,
    });
  } catch (error) {
    console.log(error),
      res.render("pages/info", {
        msg: "ValidatorError",
        user: "Update failed!",
        data: user,
      });
  }
};

module.exports.getAll = (req, res, next) => {
  const { user } = req;

  if (user.role != "admin") {
    res.render("pages/admin", {
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

      res.render("pages/admin", respond);
    })
    .catch((error) => {
      console.log(error);
      res.render("pages/admin", {
        msg: "ValidatorError",
        user: `Fail to fetch!`,
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
        res.render("pages/info", {
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
      res.render("pages/info", {
        msg: "ValidatorError",
        user: `Fail to fetch!`,
      });
    });
};

module.exports.delete = (req, res, next) => {
  const { id: _id } = req.params;
  const { user } = req;

  if (user.role != "admin") {
    res.render("pages/admin", {
      msg: "ValidatorError",
      user: `You don't have the permission!`,
      data: user,
    });
  }

  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.render("pages/admin", {
          msg: "ValidatorError",
          user: `User not found!`,
        });
      }

      User.deleteOne({ _id })
        .then(async (result) => {
          res.render("pages/admin", {
            msg: "ValidatorError",
            user: `Delete successful!`,
          });
        })
        .catch((error) => {
          res.render("pages/admin", {
            msg: "ValidatorError",
            user: `Fail to delete!`,
          });
        });
    })
    .catch((error) => {
      res.render("pages/admin", {
        msg: "ValidatorError",
        user: `Fail to delete!`,
      });
    });
};

//
