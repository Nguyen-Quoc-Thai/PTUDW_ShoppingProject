var express = require("express");
var router = express.Router();
const userController = require("../controllers/user.controller");

const upload = require("./../config/multer");

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./../middlewares/auth.middleware");

router.get("/auth", checkNotAuthenticated, userController.getAuth);
router.post("/register", checkNotAuthenticated, userController.postSignUp);
router.post("/login", checkNotAuthenticated, userController.postSignIn);
router.post("/logout", checkAuthenticated, userController.postSignOut);
router.get("/confirm/:token", checkNotAuthenticated, userController.getConfirm);
//

router.get("/", checkAuthenticated, userController.getAll);
router.get("/:id", checkAuthenticated, userController.getOne);
router.delete("/:id", checkAuthenticated, userController.deleteOne);

router.post(
  "/forgot",
  checkNotAuthenticated,
  userController.postForgotPassword
);
router.get(
  "/forgot/:token",
  checkNotAuthenticated,
  userController.getResetPassword
);

router.post("/reset", checkNotAuthenticated, userController.postResetPassword);

router.get(
  "/account/dashboard",
  checkAuthenticated,
  userController.getDashboard
);
router.put(
  "/account/password",
  checkAuthenticated,
  userController.putUpdatePassword
);

router.put(
  "/account/info",
  checkAuthenticated,
  upload.single("thumbnail"),
  userController.putUpdateInfo
);

router.post("/wishlist", checkAuthenticated, userController.getWishlist);

router.post(
  "/like/:productSlugName",
  checkAuthenticated,
  userController.postLike
);

router.post("/resend", checkNotAuthenticated, userController.postResend);
router.get("/recovery", checkNotAuthenticated, userController.getRecovery);
router.post("/recovery", checkNotAuthenticated, userController.postRecovery);
router.get("/reset/:token", checkNotAuthenticated, userController.getReset);
router.post("/reset/:token", checkNotAuthenticated, userController.postReset);
router.get("/:id/info", checkAuthenticated, userController.getInfo);
router.patch("/:id", checkAuthenticated, userController.patchUpdate);

module.exports = router;
