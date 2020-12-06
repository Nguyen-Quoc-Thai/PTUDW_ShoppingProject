var express = require("express");
const { product } = require("puppeteer");
var router = express.Router();
const productController = require("../controllers/product.controller");

const {
  searchCache,
  resourceCache,
} = require("./../middlewares/redis.middleware");

/* GET users listing. */
router.get("/search", searchCache, productController.getSearch);

router.get(
  "/resource/:resourceSlugName",
  resourceCache,
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
