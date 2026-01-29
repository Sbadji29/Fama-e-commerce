const express = require('express');
const router = express.Router();
const { createOrder, validateOrder, getOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.post('/validate/:token', protect, validateOrder);

module.exports = router;
