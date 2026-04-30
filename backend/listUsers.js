const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const listUsers = async () => {
  const users = await User.find({});
  console.log('Users in DB:', users.map(u => ({ name: u.name, email: u.email })));
  process.exit();
};

listUsers();
