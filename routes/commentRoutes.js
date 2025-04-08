const express = require('express');
const { createComment, getComments, deleteComment } = require('../controllers/commentController');  // Import controller functions
const router = express.Router({ mergeParams: true }); // mergeParams allows access to the postId from the parent route

// POST route to create a new comment
router.post('/', createComment);

// GET route to fetch all comments for a specific post
router.get('/', getComments);

// DELETE route to delete a specific comment
router.delete('/:commentId', deleteComment);

module.exports = router;
