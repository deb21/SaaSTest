// Step 1: Import necessary modules
const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Step 2: Create a new router object
const router = express.Router();

// Step 3: Define a Mongoose schema and model for users
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Step 4: Define a route for user registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Step 5: Define a route for user login
router.post("/login", async (req, res) => {
  console.log("Login request received"); //debug log
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Step 6: Export the router for use in other files
module.exports = router;

/*
Instructions:
1. Save this code in a new file named `authRoutes.js` in your project directory.
2. In your main `index.js` file, import and use this router:

   const express = require('express');
   const authRoutes = require('./authRoutes'); // Adjust the path if necessary
   const app = express();

   app.use(express.json()); // Middleware to parse JSON bodies
   app.use('/auth', authRoutes);

3. Test the endpoints:
   - POST `/auth/register` with `username`, `email`, and `password` in the request body.
   - POST `/auth/login` with `email` and `password` in the request body.
*/
