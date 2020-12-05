var express = require("express");
var router = express.Router();
const userController = require("../controllers/user.controller");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./../middlewares/auth.middleware");

// router.get("/dashboard", userController.getDashboard);

// router.get("/wishlist", userController.getWishlist);

// router.get("/checkout", userController.getCheckout);

// router.get("/auth", userController.getAuth);

router.get("/auth", checkNotAuthenticated, userController.getAuth);
router.post("/register", checkNotAuthenticated, userController.postSignUp);
router.post("/login", checkNotAuthenticated, userController.postSignIn);
router.post("/logout", checkAuthenticated, userController.postSignOut);
router.get("/confirm/:token", checkNotAuthenticated, userController.getConfirm);
//

router.get("/", checkAuthenticated, userController.getAll);
router.get("/:id", checkAuthenticated, userController.getOne);
router.delete("/:id", checkAuthenticated, userController.deleteOne);

module.exports = router;
