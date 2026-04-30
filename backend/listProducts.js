const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const listProducts = async () => {
  const products = await Product.find({});
  console.log('Products in DB:', products.map(p => p.name));
  process.exit();
};

listProducts();
