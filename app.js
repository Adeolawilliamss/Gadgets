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

// const AppError = require('./utils/appError');
// const bookingController = require('./controllers/bookingController');
// const globalErrorHandler = require('./controllers/errorController');

//Starts express App immediately
const app = express();

app.enable('trust proxy');

//GLOBAL MIDDLEWARES:THESE ARE APPLIED TO ALL FILES

//Access-Control-Allow-Origin *
//Assuming we had backend at api.natours.com and frontend at natours.com,

const allowedOrigins = [
    "http://localhost:3000", // React default (Vite)
    // "http://localhost:5173", // React Vite default
    // "https://yourfrontenddomain.com", // Production domain (update this!)
  ];
app.use(
    cors({
      origin: allowedOrigins,
      credentials: true, // Allow cookies & authentication headers
    })
  );

// Serve React frontend (Only in production)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "my-app", "build")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "my-app", "build", "index.html"));
    });
}
  

//Set security HTTP headers
app.use(helmet());


//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('trust proxy', 2); // ✅ Trust only 2 proxy layer (Heroku, Vercel, etc.)

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
  //consol.log(req.cookies);
  next();
});

//THIS WOULD ONLY BE REACHED IF ALL THE OTHER ROUTERS PLUS THE TOURS AND USER ROUTERS DIDNT CATCH IT
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);

module.exports = app;