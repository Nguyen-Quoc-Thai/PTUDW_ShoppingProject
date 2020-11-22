var express = require("express");
var router = express.Router();
const userController = require("../controllers/user.controller");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./../middlewares/auth.middleware");

router.get("/dashboard", userController.getDashboard);

router.get("/wishlist", userController.getWishlist);

router.get("/checkout", userController.getCheckout);

router.get("/auth", userController.getAuth);

router.post("/register", checkNotAuthenticated, userController.signUp);
router.post("/login", checkNotAuthenticated, userController.signIn);
router.get("/logout", checkAuthenticated, userController.signOut);
router.get("/confirm/:token", checkNotAuthenticated, userController.confirm);
router.post("/resend", checkNotAuthenticated, userController.resend);
router.get("/recovery", checkNotAuthenticated, userController.getRecovery);
router.post("/recovery", checkNotAuthenticated, userController.postRecovery);
router.get("/reset/:token", checkNotAuthenticated, userController.getReset);
router.post("/reset/:token", checkNotAuthenticated, userController.postReset);
router.patch("/:id", checkAuthenticated, userController.patchUpdate);
router.get("/", checkAuthenticated, userController.getAll);
router.get("/:id", checkAuthenticated, userController.getOne);
router.delete("/:id", checkAuthenticated, userController.delete);


// router.get("/test", checkNotAuthenticated, userController.getTest);

module.exports = router;
