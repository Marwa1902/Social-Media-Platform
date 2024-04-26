const router = require("express").Router();
const Comment = require("../models/Comment");

// Add a new comment
router.post("/", async (req, res) => {
    try {
        const { postId, userId, text } = req.body;

        // Validate input data
        if (!postId || !userId || !text) {
            return res.status(400).json({ message: "postId, userId, and text are required" });
        }

        // Create the comment
        const comment = await Comment.create({ postId, userId, text });

        res.status(201).json(comment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a comment by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the comment exists
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Delete the comment
        await comment.remove();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
