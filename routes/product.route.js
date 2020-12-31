const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const productApiController = require('../api/v1/controllers/product');

// const {
//   searchCache,
//   resourceCache,
// } = require("./../middlewares/redis.middleware");

/*-------------- Routes ---------------*/
/* Get global search page */
router.get('/search', productController.getSearch);

/* Get 1 category page */
router.get(
	'/resource/:resourceSlugName',
	productController.getResourceProducts
);

/* Get product info page */
router.get('/:productSlugName', productController.getProductDetails);

/*------------- API routes ------------*/
/* Post a comment */
router.post(
	'/api/v1/comment/:productSlugName',
	productApiController.postComment
);

module.exports = router;
