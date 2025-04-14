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

  // Set access token in response headers (for Postman and frontend use)
  res.setHeader('Authorization', `Bearer ${accessToken}`);

  // Set access token in response
  res.cookie('jwt', accessToken, {
    expires: new Date(Date.now() + 60 * 60 * 1000), // 60 minutes
    httpOnly: true,
    secure: req.secure || req.get('x-forwarded-proto') === 'https',
    sameSite: 'Lax',
    path: '/',
  });

  // Set refresh token in a separate cookie
  res.cookie('refreshToken', refreshToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: req.secure || req.get('x-forwarded-proto') === 'https',
  });

  user.password = undefined; // Hide password in response

  res.status(statusCode).json({
    status: 'success',
    accessToken, // Send access token to client
    refreshToken,
    data: { user },
  });
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError('No refresh token provided', 403));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log('Decoded JWT:', decoded); // Debugging

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 403));
    }

    const newAccessToken = signAccessToken(user._id);

    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    res.cookie('jwt', newAccessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      httpOnly: true,
      secure: req.secure || req.get('x-forwarded-proto') === 'https',
    });

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

  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log('🔍 Protect Middleware Triggered on:', req.path); // Debugging
  //1}Getting token and checking if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to continue', 404),
    );
  }
  //2}Verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_SECRET,
  );

  //3}Check if user still exists
  const currentUser = await User.findById(decoded.id);
  // console.log('Current User:', currentUser);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );
  }

  //4}Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// ✅ Fixing isLoggedIn to work for API calls
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_ACCESS_SECRET,
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'Not logged in' });
      }

      req.user = currentUser;
      res.locals.user = currentUser;

      // ✅ Respond with user info or just status success
      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            photo: currentUser.photo,
          },
        },
      });
    }

    // No token
    return res.status(401).json({ status: 'fail', message: 'Not logged in' });
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
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
