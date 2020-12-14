const { initCart, allCategory } = require("./../utils/constant");
const Province = require("./../models/dist/province.model");

module.exports.init = function (req, res, next) {
  try {
    req.app.locals.user = req.user || null;
    req.app.locals.cart = req.session.cart || initCart;
    !req.session.cart ? (req.session.cart = initCart) : "";

    req.app.locals.categories = allCategory;

    Province.find()
      .sort({ name_with_type: "asc" })
      .then((provinces) => {
        req.app.locals.provinces = provinces;
      })
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
  next();
};
