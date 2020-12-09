const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("./../../../models/user.model");
const Product = require("./../../../models/product.model");

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
      if (fie !== "phone" && fie !== "email" && fie !== "undefined") {
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
