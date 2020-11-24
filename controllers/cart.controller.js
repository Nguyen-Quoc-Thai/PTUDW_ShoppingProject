const Cart = require("./../models/cart.model");
const Product = require("./../models/product.model");

module.exports.get = (req, res) => {
  res.render("pages/cart");
};

module.exports.getCart = async (req, res, next) => {
  const { cart } = req.session;
  const { user } = req;

  try {
    if (user) {
      const userCart = await Cart.findOne({ userId: user._id });
      return res.render("pages/auth", {
        // page cart
        msg: "success",
        user: "Get cart successful!",
        data: userCart,
      });
    }

    if (!cart) {
      cart = {
        userId: null,
        status: "waiting",
        items: [],
        totalQuantity: 0,
        totalCost: 0,
      };
    }

    req.session.cart = cart;
    // {userId, status, items, totalQuantity, totalCost}
    res.render("pages/auth", {
      // page cart
      msg: "success",
      user: "Open cart successful!",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: "Fail to fetch cart!",
    });
  }
};

// AJAX
module.exports.addToCart = async (req, res, next) => {
  const { user } = req;
  const { cart } = req.session;
  const { itemId } = req.params;

  let flagNewItem = true;
  let newCartItem = [];

  try {
    const id = user._id || null;
    const userCart = await Cart.findById(id);
    if (userCart) newCartItem = userCart.items;

    const product = await Product.findById(itemId);
    if (!product) throw new Error("Product not found!");
    const { _id, name, price, thumbnail } = product;

    newCartItem = cart.items.map((item) => {
      if (item.itemId === itemId) {
        item.quantity++;
        flagNewItem = false;
      }

      return item;
    });

    if (flagNewItem) {
      newCartItem.push({
        itemId: _id,
        name,
        thumbnail: thumbnail[0],
        price,
        quantity: 1,
      });
    }

    cart.totalQuantity++;
    cart.totalCost += parseInt(price);
    cart.items = newCartItem;

    if (user) {
      await Cart.updateOne(
        { userId: user._id },
        {
          $set: {
            items: newCartItem,
            totalQuantity: cart.totalQuantity,
            totalCost: cart.totalCost,
          },
        }
      );
    }

    res.session.cart = cart;
    res.status(200).json({
      msg: "success",
      user: "Add to cart successful!",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
};

// AJAX
module.exports.patchUpdate = async (req, res, next) => {
  const enumType = ["inc", "desc", "del"];
  const { type } = req.query;

  const { itemId } = req.params;
  const { user } = req;
  const { cart } = req.session;

  let newCartItem = [];

  try {
    const id = user._id || null;
    const userCart = await Cart.findById(id);
    if (userCart) newCartItem = userCart.items;

    const product = await Product.findById(itemId);
    if (!product) throw new Error("Product not found!");
    const { price } = product;

    if (!enumType.includes(type))
      throw new Error(`Query type must be 'inc', 'desc' or 'del'!`);
    const bias = type === "inc" ? 1 : type === "desc" ? -1 : 0;

    newCartItem = cart.items.map((item) => {
      if (item.itemId === itemId) {
        if (item.quantity === 1 && type === "desc") {
          return null;
        } else if (type === "del") {
          cart.totalQuantity -= parseInt(item.quantity);
          cart.totalCost -= parseInt(item.quantity) * parseInt(item.price);

          return null;
        } else {
          cart.totalQuantity += bias;
          cart.totalCost += bias * parseInt(item.price);
          item.quantity += bias;
        }
      }

      return item;
    });

    newCartItem = newCartItem.filter((item) => item !== null);

    cart.items = newCartItem;

    if (user) {
      await Cart.updateOne(
        { userId: user._id },
        {
          $set: {
            items: newCartItem,
            totalQuantity: cart.totalQuantity,
            totalCost: cart.totalCost,
          },
        }
      );
    }

    res.session.cart = cart;
    res.status(200).json({
      msg: "success",
      user: "Update cart successful!",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
};
