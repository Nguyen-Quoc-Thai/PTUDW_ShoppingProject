const Cart = require("./../models/cart.model");
const Product = require("./../models/product.model");

const { parsePrice } = require("./../utils/statistic");

module.exports.getCart = async (req, res, next) => {
  const { cart } = req.session;
  const { user } = req;

  console.log(req.app.locals.user);

  try {
    if (user) {
      const userCart = await Cart.findOne({ userId: user._id });
      if (!userCart) {
        const cart = new Cart({ userId: user._id });
        await cart.save();

        req.session.cart = cart;
      }
    }

    // cart: {userId, status, items, totalQuantity, totalCost}
    // items: {itemId, name, thumbnail, price, quantity, total}
    return res.render("pages/cart", {
      msg: "success",
      user: "Get cart successful!",
    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      message: "Fail to fetch cart!",
      error,
    });
  }
};

// AJAX
module.exports.addToCart = async (req, res, next) => {
  const { user } = req;
  let { cart } = req.session;
  const { slugName } = req.params;

  let flagNewItem = true;

  try {
    if (user) {
      const userCart = await Cart.findOne({
        userId: user._id,
        status: "waiting",
      });

      if (!userCart) {
        cart = await Cart.create({ userId: user._id });
      } else cart = userCart;
    }

    const product = await Product.findOne({
      slugName,
    });

    if (!product) throw new Error("Product not found!");
    const { _id, name, price, images } = product;

    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].name === name) {
        cart.items[i].quantity++;
        cart.items[i].total += parsePrice(price);

        flagNewItem = false;
      }
    }

    if (flagNewItem) {
      cart.items.push({
        itemId: _id,
        name,
        slugName,
        thumbnail: images[0],
        price,
        quantity: 1,
        total: parsePrice(price),
      });
    }

    cart.totalQuantity++;
    cart.totalCost += parsePrice(price);

    if (user) {
      await Cart.updateOne(
        { userId: user._id },
        {
          $set: cart,
        }
      );
    }

    console.log(cart);

    req.session.cart = cart;
    res.status(200).json({
      msg: "success",
      user: "Add to cart successful!",
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
