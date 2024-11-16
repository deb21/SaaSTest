// Step 1: Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const subscriptionRoutes = require("./subscriptionRoutes"); // Adjust the path if necessary

// Step 2: Create a function to connect to the database
async function connectToDatabase() {
  try {
    const connectionString =
      "mongodb+srv://debayandey:fzdo5v26wQrMUfz3@noteappcluster.fchrw.mongodb.net/?retryWrites=true&w=majority&appName=NoteAppCluster";

    await mongoose.connect(connectionString);

    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}

// Step 3: Call the function to establish the connection
connectToDatabase();

// Step 4: Import authRoutes
const authRoutes = require("./authRoutes");

// Step 5: Initialize Express
const app = express();

// Step 6: Use middleware to parse JSON
app.use(express.json());

const path = require("path");
//Serve Static files from the root directory
app.use(express.static(path.join(__dirname, ".")));

// Step 7: Use authRoutes
app.use("/auth", authRoutes);
app.use("/subscription", subscriptionRoutes);
const noteRoutes = require("./noteRoutes"); // Import note routes
app.use("/api", noteRoutes); // Use the routes under '/api'

// Step 8: Define a test route
app.get("/", (req, res) => {
  res.send("Welcome to the Note-Taking App API");
});

// Step 9: Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export mongoose (optional, for use in other files)
module.exports = mongoose;
