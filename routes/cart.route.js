var express = require("express");
var router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/", cartController.getCart);

module.exports = router;
