var express = require("express");
var router = express.Router();
const cartController = require("../controllers/cart.controller");
const cartApiController = require("./../api/v1/controllers/cart");

// Controller
router.get("/", cartController.getCart);

// API
router.post("/api/v1/:slugName", cartApiController.addToCart);
router.put("/api/v1/:slugName", cartApiController.putUpdate);

module.exports = router;
