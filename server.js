const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

// Product routes
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('API running');
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});


