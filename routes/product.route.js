const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const productApiController = require('../api/v1/controllers/product');

// const {
//   searchCache,
//   resourceCache,
// } = require("./../middlewares/redis.middleware");

// Controller
router.get('/search', productController.getSearch);
router.get(
	'/resource/:resourceSlugName',
	productController.getResourceProducts
);
router.get('/:productSlugName', productController.getProductDetails);

// API
router.post(
	'/api/v1/comment/:productSlugName',
	productApiController.postComment
);

// router.get('/', productController.getAll);
// router.get('/:id', productController.getOne);
// router.get("/filter", productController.filterProducts);
// router.get("/:id", productController.getProductDetails);
// router.post('/', productController.create);
// router.patch('/:id', productController.patchUpdate);

module.exports = router;
