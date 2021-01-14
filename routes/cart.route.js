const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');
const cartApiController = require('./../api/v1/controllers/cart');

/*-------------- Routes ---------------*/
/* Get cart page */
router.get('/', cartController.getCart);

/*------------- API routes ------------*/
/* Add to cart */
router.post('/api/v1/:slugName', cartApiController.addToCart);

/* Update cart */
router.put('/api/v1/:slugName', cartApiController.putUpdate);

module.exports = router;
