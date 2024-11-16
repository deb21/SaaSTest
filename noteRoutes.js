const express = require("express");
const Note = require("./noteModel"); // Import the Note model
const authenticateUser = require("./authMiddleware");

const router = express.Router();

// Create a new note
router.post("/notes", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming the logged-in user ID is in `req.user`

    const newNote = new Note({ title, content, userId });
    await newNote.save();

    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note" });
  }
});

// Get all notes for the logged-in user
router.get("/notes", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ userId });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Update a note by ID
router.put("/notes/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content },
      { new: true }, // Return the updated document
    );

    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    res
      .status(200)
      .json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note" });
  }
});

// Delete a note by ID
router.delete("/notes/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId });

    if (!deletedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    res
      .status(200)
      .json({ message: "Note deleted successfully", note: deletedNote });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note" });
  }
});

module.exports = router;

/*
Integration Steps:
1. Save this code in a new file named `noteRoutes.js`.
2. In your `index.js` file, import and use this router:

   const noteRoutes = require('./noteRoutes'); // Adjust the path if necessary
   app.use('/api', noteRoutes); // Use the routes under '/api'

3. Ensure your authentication middleware populates `req.user` with the logged-in user's info.
*/
