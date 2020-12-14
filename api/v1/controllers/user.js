const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("./../../../models/user.model");
const Product = require("./../../../models/product.model");
const District = require("./../../../models/dist/district.model");
const Village = require("./../../../models/dist/village.model");

const cloudinary = require("./../../../config/cloudinary");

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
      if (!["phone", "email", "undefined"].includes(fie)) {
        user[fie] = body[fie];
      }
    }

    if (req.file) {
      const ret = await cloudinary.uploadSingleAvatar(req.file.path);
      if (ret) {
        await cloudinary.destroySingle(user.cloudinary_id);
        user.avatar = ret.url;
        user.cloudinary_id = ret.id;
      }

      console.log(ret);
    }

    await User.updateOne({ _id: user._id }, { $set: user });

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

// AJAX
module.exports.postLike = async (req, res, next) => {
  const { productSlugName } = req.params;
  const { user } = req;

  try {
    if (user.likes.map((pro) => pro.slugName).includes(productSlugName)) {
      return res.status(201).json({
        msg: "success2",
        user: `This product has been added before!`,
      });
    }

    const product = await Product.findOne({ slugName: productSlugName });
    const { name, slugName, price, images } = product;

    const like = {
      name,
      slugName,
      price,
      images,
      date: new Date(),
    };

    user.likes.push(like);
    await User.updateOne(
      { _id: user._id },
      {
        $set: user,
      }
    );

    res.status(201).json({
      msg: "success",
      user: `Your like has been public!`,
      data: like,
    });
  } catch (error) {
    console.log(error);
    res.status(205).json({
      msg: "ValidatorError",
      user: error.message,
      error,
    });
  }
};

// AJAX
module.exports.postUnLike = async (req, res, next) => {
  const { productSlugName } = req.params;
  let { user } = req;

  try {
    user.likes = user.likes.filter((ele) => ele.slugName != productSlugName);
    await User.updateOne({ _id: user._id }, { $set: user });

    console.log(user.likes.length);
    req.user = user;
    res.status(201).json({
      msg: "success",
      user: `Your delete has been execute!`,
      data: user.likes,
    });
  } catch (error) {
    console.log(error);
    res.status(205).json({
      msg: "ValidatorError",
      user: error.message,
      error,
    });
  }
};

// Validator

// Signup
module.exports.postCheckExist = async (req, res, next) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

  try {
    const key = Object.keys(req.body)[0];

    let respond = {
      msg: "success",
    };

    switch (key) {
      case "email": {
        const userWithEmail = await User.findOne({ email: req.body[key] });
        if (userWithEmail) {
          respond.email = "Địa chỉ email đã có người sử dụng!";
        }
        if (!req.body[key].match(emailRegex)) {
          respond.email = "Email không hợp lệ!";
        }
        break;
      }
      case "phone": {
        const userWithPhone = await User.findOne({ phone: req.body[key] });
        if (userWithPhone) {
          respond.phone = "Số điện thoại đã có người sử dụng!";
        }
        if (!req.body[key].match(phoneRegex)) {
          respond.phone = "Số điện thoại không hợp lệ!";
        }
        break;
      }
      case "password": {
        if (req.body[key].length < 6) {
          respond.password = "Độ dài mật khẩu tối thiểu là 6!";
        } else if (req.body[key].length > 20) {
          respond.password = "Độ dài mật khẩu tối đa là 20!";
        }
        break;
      }
    }

    if (Object.keys(respond).length > 1) {
      respond.msg = "error";
    }

    res.status(200).json(respond);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: error.message,
      error,
    });
  }
};

module.exports.getDistrict = async (req, res, next) => {
  const { code } = req.params;
  try {
    const districts = await District.find({
      parent_code: code,
    }).sort({ name_with_type: "asc" });

    res.status(200).json({
      msg: "success",
      data: districts,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: error.message,
      error,
    });
  }
};

module.exports.getVillage = async (req, res, next) => {
  const { code } = req.params;
  try {
    const villages = await Village.find({
      parent_code: code,
    }).sort({ name_with_type: "asc" });

    res.status(200).json({
      msg: "success",
      data: villages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: error.message,
      error,
    });
  }
};
