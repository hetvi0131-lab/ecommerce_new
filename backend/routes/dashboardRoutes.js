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
    const activeUsers = await User.countDocuments({ role: 'user' });
    
    // Calculate total revenue and weekly data
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    // Calculate last 7 days revenue for chart
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      const dayRevenue = dayOrders.reduce((acc, item) => acc + item.totalAmount, 0);
      weeklyData.push({ day: dayName, revenue: dayRevenue });
    }

    // Calculate payment distribution for Donut Chart
    const paymentStats = orders.reduce((acc, order) => {
      const method = order.paymentMethod?.toUpperCase() === 'COD' ? 'COD' : 'UPI/Online';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    const paymentData = Object.keys(paymentStats).map(key => ({
      name: key,
      value: paymentStats[key]
    }));

    // Calculate revenue by category for Donut Chart
    const categoryStats = {};
    try {
      for (const order of orders) {
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            if (item.product) {
              const product = await Product.findById(item.product);
              const category = (product && product.category) ? product.category : 'Other';
              categoryStats[category] = (categoryStats[category] || 0) + (item.price * item.quantity);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calculating category stats:', error);
    }

    const categoryData = Object.keys(categoryStats).map(key => ({
      name: key,
      value: categoryStats[key]
    }));

    res.json({
      totalRevenue,
      totalOrders,
      activeUsers,
      productsCount,
      weeklyData,
      paymentData,
      categoryData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all customers for admin
// @route   GET /api/dashboard/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
