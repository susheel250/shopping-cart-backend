const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// Routes
const cartRoutes = require('./routes/cart.routes');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');

// IMPORTANT
// Stripe webhook route BEFORE express.json()

app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' })
);

// Normal JSON middleware
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/products', productRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('API running');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});