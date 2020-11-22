const products = require("../models/products.model");

const Product = require("../models/product.model");

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

module.exports.create = async (req, res, next) => {
  const {name, price, type, quantity, details, description, producer} = req.body
  try {
    const product = new Product({name, price, type, quantity, details, description, producer})
    const result = product.save()

    console.log(result)
    res.render('pages/index', {
      msg: 'success',
      user: 'Create a new product successful!',
      data: result
    })
  }
  catch (error) {
    let respond = { msg: "ValidatorError" };
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );

    console.log(respond);
    res.render("pages/auth", { respond });
  }
}

module.exports.patchUpdate = async (req, res, next) => {
  const acceptUserFields = [
    "name",
    "price",
    "type",
    "quantity",
    "details",
    "descriptions",
    "producer",
    "tags",
    "video"
  ];

  const {id} = req.params
  const { user } = req;
  const keys = Object.keys(req.body)
  let hasPrice = false;
  let newProduct = {};

  try {
    for (const ops of keys) {
      if (acceptUserFields.includes(ops)) {
        newProduct[ops] = req.body.ops;
      }
      else {
        return res.render("pages/info", {
          msg: "ValidatorError",
          user:
            "You are only allowed to change the {name}, {price}, {type}, {quantity}, {details}, {descriptions}, {producer}, {tags}, {video}!",
          data: user,
        });
      }

      if (ops === "price") {
        hasPrice = true;
      }
    }

    if (hasPrice) {
      const product = await Product.findById(id)
      newProduct.oldPrice = product.price
    }

    const result = await Product.updateOne({ _id: id }, { $set: newProduct }, {runValidators: true});

    res.render("pages/info", {
      msg: "success",
      user: "Product updated!",
      data: result,
    });
  } catch (error) {
    console.log(error),
      res.render("pages/info", {
        msg: "ValidatorError",
        user: "Update failed!",
        data: user,
      });
  }
};

module.exports.getAll = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const items_per_page = parseInt(req.query.limit) || 100;

  if (page < 1) page = 1;

  Product.find({})
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async (products) => {
      const request = {};
      const len = await Product.find({}).count();

      request.currentPage = page;
      request.totalPages = Math.ceil(len / items_per_page);

      if (page > 1) {
        request.previous = {
          page: page - 1,
          limit: items_per_page,
        };
      }

      if (page * items_per_page < len) {
        request.next = {
          page: page + 1,
          limit: items_per_page,
        };
      }

      const respond = {
        msg: "success",
        user: "Fetch successful!",
        data: products,
      };

      res.render("pages/auth", respond); // page shop
    })
    .catch((error) => {
      console.log(error);
      res.render("pages/auth", {
        msg: "ValidatorError",
        user: `Fail to fetch!`,
      });
    });
};

module.exports.getOne = (req, res, next) => {
  const _id = req.params.id;

  Product.findById(_id)
    .then((product) => {
      if (!product) {
        res.render("pages/info", {
          msg: "ValidatorError",
          user: `Product not found!`,
        });
      } else {
        res.render("pages/info", {
          msg: "success",
          user: `Fetch successful!`,
          data: product,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.render("pages/info", {
        msg: "ValidatorError",
        user: `Fail to fetch!`,
      });
    });
};

module.exports.delete = (req, res, next) => {
  const { id: _id } = req.params;
  const { user } = req;

  if (user.role != "admin") {
    return res.render("pages/auth", {
      msg: "ValidatorError",
      user: `You don't have the permission!`
    });
  }

  Product.deleteOne({ _id })
  .then(async (result) => {
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: `Delete successful!`,
    });
  })
  .catch((error) => {
    res.render("pages/admin", {
      msg: "ValidatorError",
      user: `Fail to delete!`,
    });
  });
};