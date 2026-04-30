const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, user } = req.body;
    
    const order = new Order({
      user,
      items,
      totalAmount,
      paymentMethod
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
