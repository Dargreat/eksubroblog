// api/comments.js
const express = require('express');
const Comment = require('../models/Comment'); // Assuming Comment model is in the models folder
const router = express.Router();

// Create a new comment
router.post('/', async (req, res) => {
    try {
        const { postId, author, content } = req.body;
        const newComment = new Comment({ postId, author, content });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error });
    }
});

// Get all comments for a specific post
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
});

// Edit a comment
router.put('/:commentId', async (req, res) => {
    try {
        const { content } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { content },
            { new: true }
        );
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
});

module.exports = router;
