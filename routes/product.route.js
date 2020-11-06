var express = require("express");
var router = express.Router();
const productController = require("../controllers/product.controller");

/* GET users listing. */
router.get("/", productController.getProducts);

router.get("/filter", productController.filterProducts);

router.get("/:id", productController.getProductDetails);

module.exports = router;
