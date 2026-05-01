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

// @desc    Get all orders (Customers only)
// @route   GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      { $match: { 'userDetails.role': 'user' } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          items: 1,
          totalAmount: 1,
          paymentMethod: 1,
          status: 1,
          createdAt: 1,
          user: {
            _id: '$userDetails._id',
            name: '$userDetails.name',
            email: '$userDetails.email'
          }
        }
      }
    ]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
