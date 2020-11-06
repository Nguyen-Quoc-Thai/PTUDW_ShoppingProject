var express = require("express");
var router = express.Router();
const cartController = require("../controllers/cart.controller");

/* GET home page. */
router.get("/", cartController.get);

module.exports = router;
