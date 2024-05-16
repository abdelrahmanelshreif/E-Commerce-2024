const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const compression = require('compression');

const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const cateogryRouter = require('./routes/cateogryRoute');
const brandRouter = require('./routes/brandRoutes');
const photoRouter = require('./routes/photoRoutes');
const wishlistRouter = require('./routes/whishlistRoutes');
const cors = require('cors');

const app = express();

// Set security HTTP headers
app.use(helmet());
app.use(cors());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser , reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// DATA Sanitization against NoSQL Query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

app.use(compression());

//TEST Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/E-Commerce/api/v1/photo', photoRouter);
app.use('/E-Commerce/api/v1/order', orderRouter);
app.use('/E-Commerce/api/v1/cart', cartRouter);
app.use('/E-Commerce/api/v1/wishlist', wishlistRouter);
app.use('/E-Commerce/api/v1/user', userRouter);
app.use('/E-Commerce/api/v1/cateogries', cateogryRouter);
app.use('/E-Commerce/api/v1/brands', brandRouter);
app.use('/E-Commerce/api/v1/products', productRouter);
app.use(globalErrorHandler);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

module.exports = app;
