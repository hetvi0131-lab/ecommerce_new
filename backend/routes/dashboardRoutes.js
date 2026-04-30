const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const activeUsers = await User.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    res.json({
      totalRevenue,
      totalOrders,
      activeUsers,
      productsCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
