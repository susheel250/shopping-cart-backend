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

exports.updateCategory = async (req, res) => {

  try {

    const categoryId =
      parseInt(req.params.id);

    const { name } = req.body || {};

    const category =
      await prisma.category.update({
        where: {
          id: categoryId
        },
        data: {
          name
        }
      });

    res.json(category);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Failed to update category"
    });

  }

};