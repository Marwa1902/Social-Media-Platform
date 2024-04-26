// comments.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment"); // Import your Comment model

// POST route for creating a new comment
router.post("/", async (req, res) => {
    // Logic to handle creating a new comment
    try {
        // Extract data from request body
        const { postId, userId, text } = req.body;

        // Create a new comment using Mongoose
        const newComment = await Comment.create({ postId, userId, text });

        // Send a response with the newly created comment
        res.status(201).json({ message: "Comment created successfully", newComment });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
