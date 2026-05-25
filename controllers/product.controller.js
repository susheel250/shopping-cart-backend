const prisma = require('../config/db');

// Create product
exports.createProduct = async (req, res) => {

  try {

    const {
      name,
      price,
      description,
      categoryId
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        categoryId
      }
    });

    res.json(product);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to create product'
    });

  }
};

// Get products
exports.getProducts = async (req, res) => {

  try {

    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });

    res.json(products);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to fetch products'
    });

  }
};