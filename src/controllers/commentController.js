const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Create a new comment for a specific post
exports.createComment = async (req, res) => {
    const { postId } = req.params; // Get the postId from the URL
    const { content, author } = req.body; // Get the comment content and author from the request body

    try {
        // Create a new comment
        const newComment = new Comment({ content, author, post: postId });

        // Save the comment to the database
        await newComment.save();

        // Push the comment to the post's comments array
        const post = await Post.findById(postId);
        post.comments.push(newComment._id);
        await post.save();

        // Return the new comment
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create comment', error });
    }
};

// Get all comments for a specific post
exports.getComments = async (req, res) => {
    const { postId } = req.params; // Get the postId from the URL

    try {
        // Find the post and populate the comments field
        const post = await Post.findById(postId).populate('comments');
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Return the post's comments
        res.status(200).json(post.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get comments', error });
    }
};

// Delete a specific comment
exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params; // Get postId and commentId from the URL

    try {
        // Find the comment to delete
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Delete the comment from the Comment model
        await comment.remove();

        // Remove the comment from the post's comments array
        const post = await Post.findById(postId);
        post.comments = post.comments.filter(id => id.toString() !== commentId);
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete comment', error });
    }
};
