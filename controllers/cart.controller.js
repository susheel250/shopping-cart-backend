const prisma = require('../config/db');

// Add to cart
exports.addToCart = async (req, res) => {

  try {

    // Logged-in user from token
    const userId = req.user.userId;
  
    const {
      productId,
      quantity
    } = req.body;

    // Create cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      }
    });

    res.json(cartItem);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to add to cart'
    });

  }
};

// Get cart items
exports.getCartItems = async (req, res) => {

  try {

    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId
      },

      include: {
        product: true
      }
    });

    res.json(cartItems);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to fetch cart items'
    });

  }
};

exports.removeCartItem =
async (req, res) => {

  try {

    const cartId =
      parseInt(req.params.id);

    await prisma.cartItem.delete({

      where: {
        id: cartId
      }

    });

    res.json({
      message:
        'Cart item removed'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        'Failed to remove cart item'
    });

  }

};