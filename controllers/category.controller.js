const prisma = require('../config/db');

// Create category
exports.createCategory = async (req, res) => {

  try {

    const { name } = req.body;

    const category = await prisma.category.create({
      data: {
        name
      }
    });

    res.json(category);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to create category'
    });

  }
};

// Get categories
exports.getCategories = async (req, res) => {

  try {

    const categories = await prisma.category.findMany();

    res.json(categories);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to fetch categories'
    });

  }
};