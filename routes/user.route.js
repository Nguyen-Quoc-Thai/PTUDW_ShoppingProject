const passport = require('passport');
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const userApiController = require('./../api/v1/controllers/user');

const upload = require('./../config/multer');

const {
	checkAuthenticated,
	checkNotAuthenticated,
} = require('./../middlewares/auth.middleware');

/*-------------- Routes ---------------*/
/* Get auth page */
router.get('/auth', checkNotAuthenticated, userController.getAuth);

/* Post create user */
router.post('/register', checkNotAuthenticated, userController.postSignUp);

/* Post user login */
router.post('/login', checkNotAuthenticated, userController.postSignIn);

/* Post user logout */
router.post('/logout', checkAuthenticated, userController.postSignOut);

/* Confirm account */
router.get('/confirm/:token', checkNotAuthenticated, userController.getConfirm);

/* Get forgot password */
router.get(
	'/forgot/:token',
	checkNotAuthenticated,
	userController.getResetPassword
);

/* Post send an email reset password */
router.post(
	'/forgot',
	checkNotAuthenticated,
	userController.postForgotPassword
);

/* Post a new password reset */
router.post('/reset', checkNotAuthenticated, userController.postResetPassword);

/* Get user dashboard */
router.get(
	'/account/dashboard',
	checkAuthenticated,
	userController.getDashboard
);

/* Get user wishlist */
router.get('/wishlist', checkAuthenticated, userController.getWishlist);

/* Google OAuth strategy */
router.get(
	'/google',
	checkNotAuthenticated,
	passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
	'/google/callback',
	checkNotAuthenticated,
	userController.getGoogleCallback
);

/* Facebook OAuth strategy */
router.get(
	'/facebook',
	checkNotAuthenticated,
	passport.authenticate('facebook', { scope: 'email' })
);
router.get(
	'/facebook/callback',
	checkNotAuthenticated,
	userController.getFacebookCallback
);

/*------------- API routes ------------*/
/* Update user password */
router.put(
	'/api/v1/account/password',
	checkAuthenticated,
	userApiController.putUpdatePassword
);

/* Update user info */
router.put(
	'/api/v1/account/info',
	checkAuthenticated,
	upload.single('thumbnail'),
	userApiController.putUpdateInfo
);

/* Add a product to user wishlist */
router.post(
	'/api/v1/like/:productSlugName',
	checkAuthenticated,
	userApiController.postLike
);

/* Delete a product from user wishlist */
router.post(
	'/api/v1/unlike/:productSlugName',
	checkAuthenticated,
	userApiController.postUnLike
);

/* Validate signup */
router.post(
	'/api/v1/exist',
	checkNotAuthenticated,
	userApiController.postCheckExist
);

/* Dynamic select options */
router.get('/api/v1/district/:code', userApiController.getDistrict);
router.get('/api/v1/village/:code', userApiController.getVillage);

module.exports = router;
