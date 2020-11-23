var express = require("express");
var router = express.Router();
const indexController = require("../controllers/index.controller");
const productController = require("./../controllers/product.controller");
const cartController = require("./../controllers/cart.controller");

const upload = require('./../config/multer')

/* GET home page. */
router.get("/", indexController.get);

router.get("/products/computers", productController.getAllComputer);
router.get("/products/laptops", productController.getAllLaptop);
router.get("/products/mobiles", productController.getAllMobile);

router.get("/products", productController.getAll);
router.get("/products/:id", productController.getOne);
router.post("/products", upload.array('thumbnail', 5), productController.postCreate);
router.patch("/products/:id", productController.patchUpdate);
router.delete("products/:id", productController.deleteOne);

router.get("products/:id/comments", productController.getAllComment);
router.post("products/:id/comments", productController.postComment);
router.post("products/:id/likes", productController.postLike);

router.get('cart', cartController.getCart)
router.post('cart/:itemId', cartController.addToCart)

module.exports = router;
