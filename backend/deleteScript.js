const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const deleteProductByName = async () => {
  try {
    const result = await Product.deleteMany({ name: { $regex: /nack/i } });
    console.log(`${result.deletedCount} product(s) deleted successfully!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

deleteProductByName();
