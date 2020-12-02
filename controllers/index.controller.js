const products = require("../models/products.model");
const Product = require("./../models/product.model");

const { allCategory } = require("./../utils/constant");

module.exports.index = async (req, res, next) => {
  const result = {};
  for (const key of allCategory) {
    result[key.name] = await Product.find({
      type: key.name,
    }).limit(10);
  }

  req.session.cart = {
    userId: null,
    status: "waiting",
    items: [],
    totalQuantity: 0,
    totalCost: 0,
  };

  res.render("pages/index", {
    msg: "success",
    categories: allCategory || [],
    data: result || [],
  });
};
