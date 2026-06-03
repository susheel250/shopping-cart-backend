const prisma = require("../config/db");

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { orderId } = req.body;

    // Get selected order
    const order = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
        userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Check order exists
    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Prevent duplicate payment records
    const existingPayment = await prisma.payment.findFirst({
      where: {
        orderId: order.id,
      },
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: "STRIPE",
          status: "PENDING",
        },
      });
    }

    // Create Stripe line items
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "inr",

        product_data: {
          name: item.product.name,
        },

        unit_amount: item.product.price * 100,
      },

      quantity: item.quantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: lineItems,

      mode: "payment",

      metadata: {
        orderId: order.id.toString(),
      },

      success_url:
        "http://localhost:5173/payment/success",

      cancel_url:
        "http://localhost:5173/payment/cancel",
    });

    return res.json({
      url: session.url,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Stripe checkout failed",
    });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log(err);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Payment completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = parseInt(session.metadata.orderId);

    // Create payment record
    await prisma.payment.update({
      where: {
        orderId,
      },

      data: {
        status: "SUCCESS",

        txnId: session.payment_intent,
      },
    });

    // Update order
    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: "PAID",
      },
    });

    console.log("Payment success updated");
  }

  res.json({
    received: true,
  });
};

exports.getLatestPayment =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const payment =
      await prisma.payment.findFirst({

        orderBy: {
          id: 'desc'
        },

        include: {
          order: true
        }

      });

    res.json(payment);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        'Failed to fetch payment'
    });

  }

};
