const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("./../models/user.model");

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

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
