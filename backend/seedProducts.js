const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('./models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => console.error('❌ DB connection error:', err));

// Load JSON file
const dataPath = path.join(__dirname, 'data', 'products.json');
const productData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const seedDB = async () => {
  try {
    await Product.insertMany(productData);
    console.log("✅ Product data seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding product data:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
