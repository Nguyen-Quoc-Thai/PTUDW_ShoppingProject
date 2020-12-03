const products = require("../models/products.model");
const Product = require("./../models/product.model");

const { allCategory } = require("./../utils/constant");

module.exports.index = async (req, res, next) => {
  console.log("req user", req.user);
  console.log(req.session);
  try {
    const resultPromise = Promise.all(
      allCategory.map(async (cate) => {
        const ret = await Product.find({
          type: cate.name,
        }).limit(10);

        return ret;
      })
    );

    const result = await resultPromise;

    res.render("pages/index", {
      msg: "success",
      categories: allCategory || [],
      data: result || [],
    });
  } catch (error) {
    res.render("error", {
      message: error.message,
      error,
    });
  }
};
