const mongoose = require("mongoose");

// Define the schema for the Note
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
});

// Create the model for the Note
const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
