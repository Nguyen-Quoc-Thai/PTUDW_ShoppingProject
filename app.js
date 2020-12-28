require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const compression = require('compression');
const minify = require('express-minify');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const connectDB = require('./config/db');
const session_secret = process.env.SESSION_SECRET;

const indexRouter = require('./routes/index.route');
const userRouter = require('./routes/user.route');
const productRouter = require('./routes/product.route');
const cartRouter = require('./routes/cart.route');
const checkoutRouter = require('./routes/checkout.route');
const contactRouter = require('./routes/contact.route');

require('./config/passport')(passport);

const { init } = require('./middlewares/init.middleware');

const app = express();
app.use(
	compression({
		level: 6,
		threshold: 25 * 1000,
	})
);
app.use(
	minify({
		css_match: /css/,
		js_match: /javascript/,
		blacklist: [/\.min\.(css|js)$/],
	})
);

// Connect DB
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Cache control
const cacheOptions = {
	etag: true,
	maxAge: 1000 * 60 * 5,
	cacheControl: 'public',
	immutable: true,
	setHeaders: function (res, path, stat) {
		res.set({
			'x-timestamp': Date.now(),
		});
	},
};

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), cacheOptions));

// Passport require
app.use(
	session({
		secret: session_secret,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware update info
app.use(init);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/contact', contactRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
