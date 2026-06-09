const prisma = require("../config/db");

const fs = require("fs");
const path = require("path");

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();

    const totalProducts = await prisma.product.count();

    const totalOrders = await prisma.order.count();

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json({ message: "Order status updated" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to update order status",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    console.log(productId);
    const { name, description, price, categoryId } = req.body;

    const data = {};

    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = parseInt(price);
    if (categoryId) data.categoryId = parseInt(categoryId);

    // If a new image was uploaded, prepare to replace
    if (req.file) {
      data.image = req.file.filename;
    }
    // Fetch existing product to know current image (for deletion)
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    // Delete old image file if a new one was uploaded
    if (req.file && existing && existing.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        existing.image,
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log("Failed to delete old image:", err);
      });
    }

    res.json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to update product",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to delete product",
    });
  }
};

exports.restoreProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        deletedAt: null,
      },
    });

    res.json({
      message: "Product restored successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to restore product",
    });
  }
};

exports.getDeletedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      orderBy: {
        deletedAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch deleted products",
    });
  }
};
