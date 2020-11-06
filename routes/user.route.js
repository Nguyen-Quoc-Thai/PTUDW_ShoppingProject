var express = require("express");
var router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/dashboard", userController.getDashboard);

router.get("/wishlist", userController.getWishlist);

router.get("/checkout", userController.getCheckout);

router.get("/auth", userController.getAuth);

module.exports = router;
