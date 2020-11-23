const Product = require("./../models/product.model");

module.exports.get = (req, res) => {
  res.render("pages/cart");
};

module.exports.getCart = async (req, res, next) => {
  const { cart } = req.session;

  if (!cart) {
    cart = [];
  }

  // {itemId, name, price, quantity}
  res.render("pages/auth", {
    // page cart
    msg: "success",
    user: "Open cart successful!",
    data: cart,
  });
};

// AJAX (bugs)
module.exports.addToCart = async (req, res, next) => {
  const { user } = req;
  const { cart } = req.session;
  const { itemId } = req.params;

  let flagNewItem = true;

  if (!user) {
    if (!cart) cart = [];

    const newCart = cart.map((ele) => {
      if (ele.itemId === itemId) {
        flagNewItem = false;
        ele.quantity++;
      }

      return {
        itemId: ele.itemId,
        name: ele.name,
        thumbnail: ele.thumbnail,
        price: ele.price,
        quantity: ele.quantity,
      };
    });

    if (flagNewItem) {
      await Product.findById(itemId)
        .then((result) => {
          newCart.push({
            itemId: result.itemId,
            name: result.name,
            thumbnail: result.thumbnail[0],
            price: result.price,
            quantity: result.quantity,
          });

          res.session.cart = newCart;
          res.status(200).json({
            msg: "success",
            user: "Add to cart successful!",
            data: newCart,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            msg: "ValidatorError",
            user: "Add to cart failed!",
          });
        });
    }
  }
};
