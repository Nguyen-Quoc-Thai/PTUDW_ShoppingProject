const products = require("../models/products.model");

module.exports.getProducts = (req, res) => {
  res.render("pages/products", { products });
};

module.exports.getProductDetails = (req, res) => {
  console.log(req.params.id, typeof req.params.id);

  console.log(products);
  const product = products.find(
    (product) => product.id.toString() === req.params.id
  );
  res.render("pages/productDetail", { product });
};
