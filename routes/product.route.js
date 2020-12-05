var express = require("express");
const { product } = require("puppeteer");
var router = express.Router();
const productController = require("../controllers/product.controller");

/* GET users listing. */
router.get("/search", productController.getSearch);

router.get(
  "/resource/:resourceSlugName",
  productController.getResourceProducts
);

router.get("/:productSlugName", productController.getProductDetails);

router.post("/comment/:productSlugName", productController.postComment);

// router.get('/', productController.getAll);
// router.get('/:id', productController.getOne);
// router.get("/filter", productController.filterProducts);
// router.get("/:id", productController.getProductDetails);
// router.post('/', productController.create);
// router.patch('/:id', productController.patchUpdate);

module.exports = router;
