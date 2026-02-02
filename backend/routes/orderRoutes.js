const express = require('express');
const router = express.Router();
const { createOrder, validateOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.post('/validate/:token', protect, validateOrder);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
