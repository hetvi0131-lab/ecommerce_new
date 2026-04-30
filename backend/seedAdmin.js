const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@vogue.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@vogue.com',
      password: 'admin123', // This will be hashed by the model pre-save hook
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@vogue.com');
    console.log('Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
