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
