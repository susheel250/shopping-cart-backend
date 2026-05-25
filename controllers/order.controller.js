const prisma = require('../config/db');

// Create order
exports.createOrder = async (req, res) => {

  try {

    const userId = req.user.userId;

    // Get cart items with product
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId
      },

      include: {
        product: true
      }
    });

    // Check empty cart
    if (cartItems.length === 0) {

      return res.status(400).json({
        error: 'Cart is empty'
      });

    }

    // Calculate total
    let total = 0;

    for (const item of cartItems) {

      total += item.product.price * item.quantity;

    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        total
      }
    });

    // Create order items
    for (const item of cartItems) {

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity
        }
      });

    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: {
        userId
      }
    });

    res.json({
      message: 'Order created successfully',
      total,
      order
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to create order'
    });

  }
};