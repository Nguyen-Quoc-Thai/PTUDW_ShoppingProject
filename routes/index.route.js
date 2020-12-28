const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller');

// const { homeCache } = require("./../middlewares/redis.middleware");

/* GET home page. */
// router.get("/", indexController.get);
router.get('/', indexController.index);

// router.get("/products/computers", productController.getAllComputer);
// router.get("/products/laptops", productController.getAllLaptop);
// router.get("/products/mobiles", productController.getAllMobile);
// router.get("/products", productController.getAll);
// router.get("/products/:id", productController.getOne);
// router.post("/products", upload.array('thumbnail', 5), productController.postCreate);
// // API
// router.patch("/products/:id", productController.patchUpdate);
// router.delete("/products/:id", productController.deleteOne);
// router.get("/products/:id/relative", productController.getRelative);
// router.get("/products/statistic", productController.getStatisticProducer);

// router.get("/products/:id/comments", productController.getAllComment);
// router.post("/products/:id/comments", productController.postComment);
// router.post("/products/:id/likes", productController.postLike);

// router.get('/cart', cartController.getCart)
// // API
// router.post('/cart/:itemId', cartController.addToCart)
// router.patch('/cart/update', cartController.patchUpdate)

// router.get('/checkout', checkoutController.getCheckout)
// router.post('/checkout', checkoutController.getCheckout)
// router.patch('/checkout/:checkoutId', checkoutController.patchUpdate)

module.exports = router;
