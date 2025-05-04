const Store = require('../models/storeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllCollections = catchAsync(async (req, res, next) => {
  const store = await Store.find();

  res.status(200).json({
    status: 'Success',
    results: store.length,
    data: {
      store,
    },
  });
});

// exports.createCollections = catchAsync(async (req, res, next) => {
//   const create = Store.create()

//   res.status(200).json({
//     status: 'Success',
//     data: {
//       create
//     }
//   })
// })
