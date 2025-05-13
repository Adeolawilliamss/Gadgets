const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const storeRouter = require('./routes/storeRoutes');

const app = express();
app.enable('trust proxy');

// ✅ CORS SETUP
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://gadgets-frontend.onrender.com',
  'https://gadgets-8unr.onrender.com',
];

// Global CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed from this origin'));
      }
    },
    credentials: true,
    exposedHeaders: ['Content-Type'],
  })
);

// ✅ Serve static image files with CORS explicitly
app.use(
  '/img',
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed from this origin'));
      }
    },
    credentials: true,
  }),
  express.static(path.join(__dirname, 'public/img'))
);

// Also allow general static access (e.g. if you have other files in public)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Security middleware
app.use(helmet());

// ✅ Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 10000,
  message: 'Too many requests from this IP, try again in an hour!',
});
app.use('/', limiter);

// ✅ Parsing and sanitization
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

// ✅ Request time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ✅ Routes
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/store', storeRouter);

// ✅ Health check
app.get('/', (req, res) => {
  res.status(200).send('Server is live and healthy');
});

// ✅ Global error handler
app.use(globalErrorHandler);

module.exports = app;
