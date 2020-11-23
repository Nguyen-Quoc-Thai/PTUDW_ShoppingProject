const mongoose = require("mongoose");

const User = require("../models/user.model");
const Product = require("../models/product.model");

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

module.exports.getAllComputer = async (req, res, next) => {
  const result = await Product.find({
    type: "computer",
  });

  res.render("pages/product.computers", {
    msg: 'success',
    data: result
  });
};

module.exports.getAllLaptop = async (req, res, next) => {
  const result = await Product.find({
    type: "laptop",
  });

  res.render("pages/product.laptops", {
    msg: 'success',
    data: result
  });
};

module.exports.getAllMobile = async (req, res, next) => {
  const result = await Product.find({
    type: "mobile",
  });

  res.render("pages/product.mobiles", {
    msg: 'success',
    data: result
  });
};

module.exports.getAll = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const items_per_page = parseInt(req.query.limit) || 100;

  if (page < 1) page = 1;

  const q = req.query.q;

  // filter
  const type = req.query.type || "";
  const producer = req.query.producer || "";
  const tag = req.query.tag || "";
  const minPrice = parseInt(req.query.minPrice) || 0;
  const maxPrice = parseInt(req.query.maxPrice) || 1000;

  //sort
  const sort = req.query.sort;
  let sortObj = {};
  if (["newest", "popular", "mostSale"].includes(sort)) {
    if (sort === "newest")
      sortObj = {
        updatedAt: 1,
      };
    else if (sort === "popular")
      sortObj = {
        countView: 1,
      };
    else
      sortObj = {
        countSale: 1,
      };
  } else {
    sortObj = {
      updatedAt: 1,
    };
  }

  Product.find({
    type: {
      $in: type,
    },
    producer: {
      $in: producer,
    },
    tags: {
      $in: tag,
    },
    price: {
      $gte: minPrice,
      $lte: maxPrice,
    },
    $or: [
      {
        name: q,
      },
      {
        rating: q,
      },
      {
        type: q,
      },
      {
        producer: q,
      },
      {
        tag: q,
      },
      {
        "details.$": q,
      },
    ],
  })
    .sort(sortObj)
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
    .then(async (product) => {
      if (!product) {
        res.render("pages/info", {
          msg: "ValidatorError",
          user: `Product not found!`,
        });
      } else {
        product.countView++;
        await Product.updateOne({ _id });

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

module.exports.postCreate = async (req, res, next) => {
  const {
    name,
    price,
    type,
    quantity,
    details,
    description,
    producer,
  } = req.body;

  let arrThumbnail = req.files.length ? req.files : []
  arrThumbnail = arrThumbnail.map(thumbnail => {
    req.hostname + '/' + thumbnail.path.replace(/\\/g,'/').replace('..', '')
  })

  try {
    const product = new Product({
      name,
      price,
      type,
      quantity,
      details,
      description,
      producer,
      thumbnail: arrThumbnail
    });
    const result = product.save();

    console.log(result);
    res.render("pages/index", {
      msg: "success",
      user: "Create a new product successful!",
      data: result,
    });
  } catch (error) {
    let respond = { msg: "ValidatorError" };
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );

    console.log(respond);
    res.render("pages/auth", { respond });
  }
};

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
    "video",
  ];

  const { id } = req.params;
  const { user } = req;
  const keys = Object.keys(req.body);
  let hasPrice = false;
  let newProduct = {};

  try {
    for (const ops of keys) {
      if (acceptUserFields.includes(ops)) {
        newProduct[ops] = req.body.ops;
      } else {
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
      const product = await Product.findById(id);
      newProduct.oldPrice = product.price;
    }

    const result = await Product.updateOne(
      { _id: id },
      { $set: newProduct },
      { runValidators: true }
    );

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

module.exports.deleteOne = (req, res, next) => {
  const _id = req.params.id;

  Product.findById(_id)
    .then(async (product) => {
      if (!product) {
        res.render("pages/info", {
          msg: "ValidatorError",
          user: `Product not found!`,
        });
      } else {
        product.countView++;
        await Product.updateOne({ _id });

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

module.exports.getRelative = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const { type, tags, producer } = product;

  const result = await Product.find({
    $or: [
      {
        type: {
          $in: type,
        },
      },
      {
        producer: {
          $in: producer,
        },
      },
      {
        tags: {
          $in: tags,
        },
      },
    ],
  });

  return res.render("pages/auth", {
    msg: "success",
    user: `Get relative product successful!`,
    data: result,
  });
};

module.exports.getAllComment = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const items_per_page = parseInt(req.query.limit) || 100;

  if (page < 1) page = 1;

  Product.find({})
    .sort(sortObj)
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
        data: products.comments,
      };

      res.render("pages/auth", respond);
    })
    .catch((error) => {
      console.log(error);
      res.render("pages/auth", {
        msg: "ValidatorError",
        user: `Fail to fetch!`,
      });
    });
};

module.exports.postComment = async (req, res, next) => {
  const { id } = req.params;
  const { content, rating } = req.body;
  let { _id } = req.user;
  let { name } = req.body;

  try {
    if (!_id) {
      _id = mongoose.Types.ObjectId();
    } else {
      name = req.user.name;
    }

    if (!name || !content || !rating) {
      return res.render("pages/auth", {
        // render page product detail
        msg: "ValidatorError",
        user: `Fill in all field to comment!`,
      });
    }

    const product = await Product.findById(id);
    const comment = {
      userId: _id,
      name,
      content,
      rating: parseInt(rating),
    };

    Product.updateOne({_id: id}, {
      $push: {
        comments: comment,
      },
    });

    console.log(error);
    res.render("pages/auth", {
      msg: "success",
      user: `Your comment has been public!`,
      data: product
    });
  }
  catch (error) {
    console.log(error);
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: `Fail to comment!`,
    });
  }
};

module.exports.postLike = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  try {
    const product = await Product.findById(id);
    const {name, price, thumbnail} = product

    product.countLike++
    Product.updateOne({_id: id}, {
      $set: product
    })
    User.updateOne({_id}, {
      $push: {
        likes: {
          productId: id,
          name: name,
          price: price,
          thumbnail: thumbnail,
        }
      }
    })

    // res.render('pages/product_detail', {}) // page product detail
  }
  catch (error) {
    console.log(error);
    res.render("pages/auth", {
      msg: "ValidatorError",
      user: `Fail to like!`,
    });
  }
};
