const { initCart, allCategory } = require("./../utils/constant");

module.exports.init = function (req, res, next) {
  req.app.locals.user = req.user || null;
  req.app.locals.cart = req.session.cart || initCart;
  !req.session.cart ? (req.session.cart = initCart) : "";

  req.app.locals.categories = allCategory;

  next();
};
