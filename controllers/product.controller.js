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

    // Uploaded image

    const image =
      req.file
        ? req.file.filename
        : null;

    const product = await prisma.product.create({
      data: {
        name,

        price: parseInt(price),

        description,

        categoryId: parseInt(categoryId),

        image,
      },
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

exports.getProductById = async (req, res) => {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    res.json(product);
  };