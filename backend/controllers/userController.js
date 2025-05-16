const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// MEMORY STORAGE for image buffer
const multerStorage = multer.memoryStorage();

// FILTER only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images.', 400), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Upload middleware
exports.uploadUserPhoto = upload.single('photo');

// Convert buffer to readable stream (for Cloudinary)
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Upload to Cloudinary instead of local file system
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // Resize using sharp
  const buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'profile-pictures',
      format: 'jpeg',
      public_id: `user-${req.user.id}-${Date.now()}`,
    },
    (error, result) => {
      if (error) return next(new AppError('Cloudinary upload failed', 500));
      req.file.cloudinaryUrl = result.secure_url;
      next();
    }
  );

  bufferToStream(buffer).pipe(stream);
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  // Add Cloudinary photo URL if available
  if (req.file?.cloudinaryUrl) {
    filteredBody.photo = req.file.cloudinaryUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
