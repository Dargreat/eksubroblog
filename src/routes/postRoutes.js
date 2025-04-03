<<<<<<< HEAD

const Post = require('../models/Post');
const Comment = require('../models/Comment');

=======
const express = require('express');
>>>>>>> 3f3036c97d23dc98cfe6891ad39c6d70f19eca48
const router = express.Router();
const {
    createPost,
    getPosts,
    getSinglePost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const validatePost = require('../middleware/validatePost');

// Create a new post (with validation)
router.post('/', validatePost, createPost);

// Get all posts (including comments)
router.get('/', getPosts);

// Get a single post by ID (with comments)
router.get('/:postId', getSinglePost);

// Update a post by ID
router.put('/:postId', updatePost);

// Delete a post by ID
router.delete('/:postId', deletePost);

module.exports = router;
