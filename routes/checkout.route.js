var express = require("express");
var router = express.Router();
const checkoutController = require("../controllers/checkout.controller");
const { checkAuthenticated } = require("./../middlewares/auth.middleware");

router.get("/", checkoutController.getCheckout);
router.post("/", checkoutController.postCheckout);
router.get("/:id", checkoutController.getCheckoutHistory);

module.exports = router;
