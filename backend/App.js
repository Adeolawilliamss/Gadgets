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

//Starts express App immediately
const app = express();

app.enable('trust proxy');

//GLOBAL MIDDLEWARES:THESE ARE APPLIED TO ALL FILES

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://gadgets-frontend.onrender.com',
  'https://gadgets-8unr.onrender.com'
];

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
  })
);

// ✅ Serve user-uploaded files from /public
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('trust proxy', 2);

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,try again in an hour!',
});
app.use('/api', limiter);

//Body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Cookie parser middleware
app.use(cookieParser()); // Parse cookies and make them available in req.cookies

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//Data sanitization against noSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS(cross side sripting attacks)
app.use(xss());

app.use(compression());

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  //console.log(req.cookies);
  next();
});

//ROUTES
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/store', storeRouter);

// Used only when to render both frontend and backend together
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
//   });
// }

app.use(globalErrorHandler);

module.exports = app;
