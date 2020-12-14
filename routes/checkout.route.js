var express = require("express");
var router = express.Router();
const checkoutController = require("../controllers/checkout.controller");
const checkoutApiController = require("./../api/v1/controllers/checkout");
const { checkAuthenticated } = require("./../middlewares/auth.middleware");

// Controller
router.get("/", checkoutController.getCheckout);
router.post("/", checkAuthenticated, checkoutController.postCheckout);

// Api
router.get(
  "/api/v1/:id",
  checkAuthenticated,
  checkoutApiController.getCheckoutHistory
);

module.exports = router;
