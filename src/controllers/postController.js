const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    const { title, author, content } = req.body;
    try {
        const newPost = new Post({ title, author, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};
