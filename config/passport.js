const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('./../models/user.model');

const baseURL = process.env.BASE_URL;

const clientGoogleID = process.env.GOOGLE_CLIENT_ID;
const clientGoogleSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackGoogleURL = `${baseURL}/user/google/callback`;

const clientFacebookID = process.env.FACEBOOK_CLIENT_ID;
const clientFacebookSecret = process.env.FACEBOOK_CLIENT_SECRET;
const callbackFacebookURL = `${baseURL}/user/facebook/callback`;

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			(email = '', password = '', done) => {
				User.findOne({ email })
					.then((user) => {
						// Validator
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

	passport.use(
		new GoogleStrategy(
			{
				clientID: clientGoogleID,
				clientSecret: clientGoogleSecret,
				callbackURL: callbackGoogleURL,
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

	passport.use(
		new FacebookStrategy(
			{
				clientID: clientFacebookID,
				clientSecret: clientFacebookSecret,
				callbackURL: callbackFacebookURL,
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
