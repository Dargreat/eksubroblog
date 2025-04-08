const Post = require('../models/postModel');

// Create a new post
const createPost = async (req, res) => {
    try {        
        const { title, content, author } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Cloudinary URL
  
        const newPost = new Post({
          title,
          content,
          author,
          imageUrl,
        });
  
        await newPost.save();
        res.status(201).json(newPost);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
};

// Get all posts (with comments populated)
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('comments');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Get a single post by ID
const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('comments');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
};

// Update a post by ID
const updatePost = async (req, res) => {
    try {
        const { title, author, content, id } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Cloudinary URL

        const updatedPost = await Post.findByIdAndUpdate(
            id,
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
};

// Delete a post by ID
const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};

module.exports = {
    createPost,
    getPosts,
    getSinglePost,
    updatePost,
    deletePost
};
