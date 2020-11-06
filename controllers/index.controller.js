const products = require("../models/products.model");

module.exports.get = (req, res) => {
  const laptops = products.filter((product) => product.type === "laptop");
  const mobiles = products.filter((product) => product.type === "mobile");
  const computers = products.filter((product) => product.type === "computer");

  res.render("pages/index", { laptops, mobiles, computers });
};
