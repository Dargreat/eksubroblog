const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
    try {
        const { title, author, content, imageUrl } = req.body;

        const newPost = new Post({
            title,
            author,
            content,
            imageUrl
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

// Get all posts with populated comments
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('comments');  // Populate the comments field
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});
// In postRoutes.js
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');

router.post('/', createPost);   // POST route to create a post
router.get('/', getPosts);      // GET route to fetch posts

module.exports = router;

// Get a single post with populated comments
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('comments');  // Populate the comments field
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
});

// Edit a post
router.put('/:postId', async (req, res) => {
    try {
        const { title, author, content, imageUrl } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { title, author, content, imageUrl },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});

module.exports = router;
// In postRoutes.js
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const validatePost = require('../middleware/validatePost');

router.post('/', validatePost, createPost);   // POST route to create a post with validation
router.get('/', getPosts);                    // GET route to fetch posts

module.exports = router;
