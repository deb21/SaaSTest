// Step 1: Import necessary modules
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51QKlrTJKBbF7urg44sMa2wv54ktx3G2c6LLUTZBnUYBqN4sVNSsFwZ1Fou8iV85AwNxgFXvxEfZyhEu66LUmyBGu00w5XT1EO5",
); // Replace with your Stripe secret key
const mongoose = require("mongoose");

// Step 2: Create a router
const router = express.Router();

// Step 3: Define the Mongoose schema and model for subscriptions
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  stripeCustomerId: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Step 4: Create a route to handle subscriptions
router.post("/subscribe", async (req, res) => {
  try {
    const { email, paymentMethodId } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a Stripe customer if not already created
    let customer;
    if (!user.stripeCustomerId) {
      customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    } else {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    }

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: "price_1QKmL0JKBbF7urg4g7zj8Zej" }], // Replace with your Stripe price ID
      expand: ["latest_invoice.payment_intent"],
    });

    // Update user to premium
    user.isPremium = true;
    await user.save();

    res.status(200).json({
      message: "Subscription successful",
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res
      .status(500)
      .json({ message: "Error creating subscription", error: error.message });
  }
});

// Step 5: Export the router
module.exports = router;

/*
Integration Steps:
1. Save this code in a new file named `subscriptionRoutes.js` in your project directory.
2. In your main `index.js` file, import and use this router:

   const subscriptionRoutes = require('./subscriptionRoutes'); // Adjust the path if necessary
   app.use('/subscription', subscriptionRoutes);

3. Test the endpoint:
   - POST `/subscription/subscribe` with JSON body:
     {
       "email": "testuser@example.com",
       "paymentMethodId": "pm_test_YOUR_PAYMENT_METHOD_ID"
     }

Replace YOUR_SECRET_KEY, YOUR_PRICE_ID, and YOUR_PAYMENT_METHOD_ID with actual values from your Stripe dashboard.
*/
