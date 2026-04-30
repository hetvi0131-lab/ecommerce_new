const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const findByPrice = async () => {
  const products = await Product.find({ price: 200 });
  console.log('Products with price 200:', products.map(p => ({ name: p.name, id: p._id })));
  process.exit();
};

findByPrice();
