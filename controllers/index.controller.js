const products = require("../models/products.model");
const Product = require('./../models/product.model')

module.exports.get = (req, res) => {
  const laptops = products.filter((product) => product.type === "laptop");
  const mobiles = products.filter((product) => product.type === "mobile");
  const computers = products.filter((product) => product.type === "computer");

  res.render("pages/index", { laptops, mobiles, computers });
};


module.exports.index = async (req, res, next) => {
  const [computers, laptops, mobiles] = await Promise.all([
    Product.find({
      type: 'computer'
    }),
    Product.find({
      type: 'laptop'
    }),
    Product.find({
      type: 'mobile'
    })
  ])

  req.session.cart = {
    userId: null,
    status: "waiting",
    items: [],
    totalQuantity: 0,
    totalCost: 0,
  };

  res.render("pages/index", {
    msg: 'success',
    laptops,
    mobiles,
    computers
  });
}