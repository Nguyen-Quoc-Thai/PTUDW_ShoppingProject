const { initCart } = require("./../utils/constant");

module.exports.init = function (req, res, next) {
  req.app.locals.user = req.user || null;

  if (req.session) {
    if (req.session.cart) req.app.locals.cart = req.session.cart;
    else req.session.cart = initCart;
  } else req.app.locals.cart = initCart;

  next();
};
