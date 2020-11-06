const products = require("../models/products.model");

module.exports.getProducts = (req, res) => {
  res.render("pages/products", { products });
};

module.exports.filterProducts = (req, res) => {
  const type = req.query.type;
  const productArray = products.filter((product) => product.type === type);
  console.log(productArray);
  res.render("pages/products", { products: productArray });
};

module.exports.getProductDetails = (req, res) => {
  const product = products.find((product) => product.id === req.params.id);

  let relatedProducts = [];

  if (product)
    relatedProducts = products.filter(
      (item) => item.type === product.type && item.id !== product.id
    );

  res.render("pages/productDetail", { product, relatedProducts });
};
