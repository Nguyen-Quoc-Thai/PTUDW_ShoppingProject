const express = require('express');
const router = express.Router();

const checkoutController = require('../controllers/checkout.controller');
const checkoutApiController = require('./../api/v1/controllers/checkout');

const { checkAuthenticated } = require('./../middlewares/auth.middleware');

/*-------------- Routes ---------------*/
/* Get checkout page */
router.get('/', checkoutController.getCheckout);

/* Post cart checkout */
router.post('/', checkoutController.postCheckout);

/*------------- API routes ------------*/
/* View checkout bill */
router.get(
	'/api/v1/:id',
	checkAuthenticated,
	checkoutApiController.getCheckoutHistory
);

module.exports = router;
