const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

// Product routes
const cartRoutes = require('./routes/cart.routes');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');


app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('API running');
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});


