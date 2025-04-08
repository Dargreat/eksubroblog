
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getSinglePost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const validatePost = require('../middleware/validatePost');
const upload = require('../config/cloudinary');
const { createComment, getComments } = require('../controllers/commentController');

// Create a new post (with validation)
router.post('/', upload.any(), validatePost, createPost);

// Get all posts (including comments)
router.get('/', getPosts);

// Get a single post by ID (with comments)
router.get('/:postId', getSinglePost);

// Update a post by ID
router.patch('/:postId', upload.any(), updatePost);

// Delete a post by ID
router.delete('/:postId', deletePost);

// POST route to create a new comment
router.post('/:postId/comments', createComment);

// GET route to fetch all comments for a specific post
router.get('/:postId/comments', getComments);

// DELETE route to delete a specific comment
// router.delete('/:commentId', deleteComment);

module.exports = router;
