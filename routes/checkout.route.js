var express = require("express");
var router = express.Router();
const checkoutController = require("../controllers/checkout.controller");

router.get("/", checkoutController.getCheckout);
router.post("/:slugName", checkoutController.postCheckout);

module.exports = router;
