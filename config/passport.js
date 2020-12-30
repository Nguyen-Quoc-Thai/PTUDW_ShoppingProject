const bcrypt = require('bcrypt');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('./../models/user.model');

const BASE_URL = process.env.BASE_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = `${BASE_URL}/user/google/callback`;

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_CALLBACK_URL = `${BASE_URL}/user/facebook/callback`;

module.exports = function (passport) {
	/**
	 * Local strategy sign in
	 */
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			(email = '', password = '', done) => {
				User.findOne({ email })
					.then((user) => {
						// Validate user info

						if (!user) {
							return done(null, false, {
								email: 'Tài khoản chưa đăng kí!',
							});
						}

						if (!user.isVerified) {
							return done(null, false, {
								account: 'Bạn cần xác thực tài khoản để đăng nhập!',
							});
						}

						if (user.google.id || user.facebook.id) {
							return done(null, false, {
								account: 'Đây là tài khoản liên kết!',
							});
						}

						if (user.status != 'active') {
							return done(null, false, {
								account: 'Tài khoản của bạn đã bị khóa!',
							});
						}

						// Password compare
						bcrypt.compare(password, user.password, (error, matched) => {
							if (error) throw new Error('Bcrypt compare failed!');

							if (matched) return done(null, user);
							else
								return done(null, false, {
									password: 'Mật khẩu không đúng!',
								});
						});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		)
	);

	/**
	 * Google strategy OAuth
	 */
	passport.use(
		new GoogleStrategy(
			{
				clientID: GOOGLE_CLIENT_ID,
				clientSecret: GOOGLE_CLIENT_SECRET,
				callbackURL: GOOGLE_CALLBACK_URL,
			},
			function (accessToken, refreshToken, profile, done) {
				console.log(profile);
				process.nextTick(function () {
					User.findOne(
						{
							$or: [
								{ 'google.id': profile.id },
								{ email: profile.emails[0].value },
							],
						},
						function (err, user) {
							if (err) {
								return done(err);
							}

							if (user) {
								if (user.google.id == undefined) {
									user.google.id = profile.id;
									user.google.token = accessToken;
									user.firstName = profile.name.givenName;
									user.lastName = profile.name.familyName;
									user.email = profile.emails[0].value;
									user.isVerified = profile.emails[0].verified;
									user.avatar = profile.photos[0].value;

									user.save();
								}

								return done(null, user);
							} else {
								let newUser = new User();
								newUser.google.id = profile.id;
								newUser.google.token = accessToken;
								newUser.firstName = profile.name.givenName;
								newUser.lastName = profile.name.familyName;
								newUser.email = profile.emails[0].value;
								newUser.isVerified = profile.emails[0].verified;
								newUser.avatar = profile.photos[0].value;

								newUser.save((err) => {
									if (err) {
										console.log(err);
										throw err;
									}

									return done(null, newUser);
								});
							}
						}
					);
				});
			}
		)
	);

	/**
	 * Facebook strategy OAuth
	 */
	passport.use(
		new FacebookStrategy(
			{
				clientID: FACEBOOK_CLIENT_ID,
				clientSecret: FACEBOOK_CLIENT_SECRET,
				callbackURL: FACEBOOK_CALLBACK_URL,
				profileFields: ['id', 'displayName', 'link', 'name', 'photos', 'email'],
			},
			function (accessToken, refreshToken, profile, done) {
				console.log(profile);
				process.nextTick(function () {
					User.findOne(
						{
							$or: [
								{ 'facebook.id': profile.id },
								{ email: profile.emails[0].value },
							],
						},
						function (err, user) {
							if (err) {
								return done(err);
							}

							if (user) {
								if (user.facebook.id == undefined) {
									user.facebook.id = profile.id;
									user.facebook.token = accessToken;
									user.firstName = profile.name.givenName;
									user.lastName = profile.name.familyName;
									user.email = profile.emails[0].value;
									user.isVerified = true;
									user.avatar = profile.photos[0].value;

									user.save();
								}

								return done(null, user);
							} else {
								let newUser = new User();
								newUser.facebook.id = profile.id;
								newUser.facebook.token = accessToken;
								newUser.firstName = profile.name.givenName;
								newUser.lastName = profile.name.familyName;
								newUser.email = profile.emails[0].value;
								newUser.isVerified = true;
								newUser.avatar = profile.photos[0].value;

								newUser.save((err) => {
									if (err) {
										console.log(err);
										throw err;
									}

									return done(null, newUser);
								});
							}
						}
					);
				});
			}
		)
	);

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done) => {
		User.findById(id, (error, user) => {
			done(error, user);
		});
	});
};
