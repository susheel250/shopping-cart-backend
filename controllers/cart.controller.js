const prisma = require("../config/db");

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    // Logged-in user from token
    const userId = req.user.userId;

    const { productId, quantity } = req.body;

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,

        productId,
      },
    });

    if (existingItem) {
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return res.json(updatedCartItem);
    }
    // Create cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });

    res.json(cartItem);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to add to cart",
    });
  }
};

// Get cart items
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },

      include: {
        product: true,
      },
    });

    res.json(cartItems);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch cart items",
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);

    await prisma.cartItem.delete({
      where: {
        id: cartId,
      },
    });

    res.json({
      message: "Cart item removed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to remove cart item",
    });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },

      select: {
        quantity: true,
      },
    });

    const count = cartItems.reduce(
      (total, item) => total + item.quantity,

      0,
    );

    res.json({
      count,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch cart count",
    });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        id: parseInt(cartItemId),
      },

      data: {
        quantity,
      },
    });

    res.json({
      message: "Quantity updated successfully",

      cartItem,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to update quantity",
    });
  }
};
