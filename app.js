const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require('express-session')
const passport = require('passport')

require('dotenv').config()

const connectDB = require('./config/db')
const session_secret = process.env.SESSION_SECRET || 'session_secret'

const indexRouter = require("./routes/index.route");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const contactRouter = require("./routes/contact.route");

require('./config/passport')(passport)

const app = express();

// Connect DB
connectDB()

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/contact", contactRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
