const stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports.checkoutSession = async () => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:4000/success",
      cancel_url: "http://localhost:4000/cancel",
    });
    return session;
  } catch (error) {
    return error;
  }
};

module.exports.paymentIntent = async ({body}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: body.amount,
            currency: 'inr',
            automatic_payment_methods: {enabled: true},
        });
        return paymentIntent;
    } catch (error) {
        return error;
    }
};
