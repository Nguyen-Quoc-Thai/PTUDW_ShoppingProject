const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("./../models/user.model");

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURL = "http://localhost:3000/user/google/callback";

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      (email = "", password = "", done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                email: "Email has not been registered!",
              });
            }

            bcrypt.compare(password, user.password, (error, matched) => {
              if (error) throw new Error("Bcrypt compare failed!");

              if (matched) return done(null, user);
              else
                return done(null, false, {
                  password: "Password does not match!",
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
        clientID,
        clientSecret,
        callbackURL,
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        process.nextTick(function () {
          User.findOne(
            {
              $or: [
                { "google.id": profile.id },
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

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
