const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  storeId: { type: Number, required: true, unique: true },

  video: { type: String, required: true },

  collection: { type: String },
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;
