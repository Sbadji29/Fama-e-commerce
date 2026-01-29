const express = require('express');
const router = express.Router();
const { getProducts, getCategories, createProduct, uploadImage, deleteProduct, updateProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/', protect, createProduct); // /api/products/ (for admin technically, but maybe prefixed in server.js)
// Wait, server.js likely: app.use('/api/products', productRoutes);

// dedicated upload route
router.post('/upload', protect, upload.single('image'), uploadImage);

router.route('/:id')
    .delete(protect, deleteProduct)
    .put(protect, updateProduct);

module.exports = router;
