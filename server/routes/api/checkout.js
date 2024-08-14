// server/routes/checkout.js
const express = require("express");
const stripe = require("../../config/stripe");
// const { default: viteConfig } = require("../../../client/vite.config");
const router = express.Router();

router.use((req, res, next) => {
  if (req.method === "POST") {
    const { body } = req;
    // const { authorization } = req.headers;
    req.options = {
      body: body,
      headers: {
        authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    };
  }
  next();
});
router.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("error", error,  req.headers);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
