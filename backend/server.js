const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Static folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
  res.send('Fama E-commerce API is running');
});

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Don't close server, just log
  console.error('Unhandled Rejection at:', promise, 'reason:', err);
});

process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  console.error(err);
  console.log("⚠️  Critical error caught. Server staying alive...");
});
