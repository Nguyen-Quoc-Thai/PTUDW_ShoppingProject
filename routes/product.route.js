var express = require("express");
var router = express.Router();
const productController = require("../controllers/product.controller");

/* GET users listing. */
router.get("/", productController.getProducts);

router.get("/filter", productController.filterProducts);

router.get("/:id", productController.getProductDetails);

// router.post('/', productController.create);
// router.get('/', productController.getAll);
// router.get('/:id', productController.getOne);
// router.patch('/:id', productController.patchUpdate);

module.exports = router;
