const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Optional: Set in header (useful for Postman/testing)
  res.setHeader('Authorization', `Bearer ${accessToken}`);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: { user },
  });
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError('No refresh token provided', 403));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 403));
    }

    const newAccessToken = signAccessToken(user._id);

    res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
    });
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token', 403));
  }
});


exports.logOut = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: req.secure || req.get('x-forwarded-proto') === 'https',
    sameSite: 'Lax',
    path: '/',
  });
  // Optionally clear refreshToken if set
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: req.secure || req.get('x-forwarded-proto') === 'https',
    sameSite: 'Lax',
    path: '/',
  });
  res.status(200).json({ status: 'success', message: 'Logged out' });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // Send login response first
  createSendToken(newUser, 200, req, res);
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  // Hash token (because we saved the hashed version in DB)
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user with this token
  const user = await User.findOne({ verificationToken: hashedToken });

  if (!user) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Token is invalid or has expired' });
  }

  // Mark email as verified
  user.emailVerified = true;
  user.verificationToken = undefined; // Remove token after verification
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, req, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1}get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user found with that email address', 404));
  }
  //2} Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3}Send the generated token to the user's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email.Try again later'),
      500,
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Logging the email and some additional data for debugging
  console.log('Login attempt for:', email);
  console.log('User found:', user);

  // Create and send token
  createSendToken(user, 200, req, res);

  console.log('Access token created and sent');
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log('🔍 Protect Middleware Triggered on:', req.path);

  let token;

  // 1) Prefer token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2) Fallback to cookie (optional support for hybrid flows)
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to continue', 401),
    );
  }

  // 3) Verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_SECRET,
  );

  // 4) Check user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );
  }

  // 5) Check password not changed after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  // ✅ Grant access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_ACCESS_SECRET,
      );
      const currentUser = await User.findById(decoded.id);
      if (currentUser && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
        res.locals.user = currentUser;
        console.log('✅ isLoggedIn: user attached:', {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          photo: currentUser.photo,
        });
        return next();
      }
    }
  } catch (err) {
    console.log('⚠️ isLoggedIn: error verifying token', err);
  }
  console.log('ℹ️ isLoggedIn: no valid JWT, continuing as guest');
  next();
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1}Get user based on Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2}If token has not expired and there is a user,set the new password
  if (!user) {
    return next(new AppError('This token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3}Update changedPasswordAt property for the user
  //4}Log the user in,send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1}Get user from the collection
  const user = await User.findById(req.user.id).select('+password');
  //2}check if the POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!', 401));
  }
  //3}If so,update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4}Log the user in,send JWT
  createSendToken(user, 200, req, res);
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new AppError('User not found', 404));

  if (!user.otp || user.otpExpires < Date.now()) {
    return next(new AppError('OTP expired. Request a new one.', 400));
  }

  const hashedotp = crypto.createHash('sha256').update(otp).digest('hex');

  if (user.otp !== hashedotp) {
    return next(new AppError('Invalid OTP. Please try again.', 400));
  }

  // Mark OTP as verified
  user.otpVerified = true;
  user.otp = undefined; // Clear OTP after verification
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  //If everythings okay,send token to client
  createSendToken(user, 200, req, res);
});
