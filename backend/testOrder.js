const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const testOrder = async () => {
  try {
    // Create a test user
    let user = await User.findOne({ email: 'test@test.com' });
    if (!user) {
      user = await User.create({ name: 'Test User', email: 'test@test.com', password: 'password123' });
    }

    // Get a product
    const product = await Product.findOne({});
    if (!product) {
      console.log('No products found');
      process.exit();
    }

    // Create an order
    const order = new Order({
      user: user._id,
      items: [{
        product: product._id,
        quantity: 1,
        price: product.price
      }],
      totalAmount: product.price,
      paymentMethod: 'Cash on Delivery'
    });

    await order.save();
    console.log('Test order created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error creating test order:', error.message);
    process.exit(1);
  }
};

testOrder();
