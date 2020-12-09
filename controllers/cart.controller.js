const Cart = require("./../models/cart.model");

module.exports.getCart = async (req, res, next) => {
  const { user } = req;

  console.log(req.app.locals.user);

  try {
    if (user) {
      const userCart = await Cart.findOne({
        userId: user._id,
        status: "waiting",
      });

      if (!userCart) {
        req.session.cart = await Cart.create({ userId: user._id });
      } else req.session.cart = userCart;
    }

    return res.render("pages/cart", {
      msg: "success",
    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      message: "Fail to fetch cart!",
      error,
    });
  }
};
