const prisma = require('../config/db');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {name,  price} = req.body;
    const product = await prisma.product.create({
      data: {name, price},
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({error: 'Failed to create product'});
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch products'});
  }
};