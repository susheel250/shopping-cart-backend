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
    const { search, categoryId, page = 1, limit = 4 } = req.query;

    const pageNumber = parseInt(page);

    const pageSize = parseInt(limit);

    const skip = (pageNumber - 1) * pageSize;

    const where = {
      ...(search && {
        name: {
          contains: search,
        },
      }),

      ...(categoryId && {
        categoryId: parseInt(categoryId),
      }),
    };

    const totalProducts = await prisma.product.count({
     where: {
        deletedAt: null,
      }
    });

    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },

      skip,

      take: pageSize,

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      products,

      currentPage: pageNumber,

      totalPages: Math.ceil(totalProducts / pageSize),

      totalProducts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch products",
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