const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },  // Optional image URL for the post
    timestamp: { type: Date, default: Date.now },  // Automatically set to current date/time
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'  // Reference to the Comment model
    }]
});

// Create the Post model from the schema
const Post = mongoose.model('Post', postSchema);

// Export the Post model to be used elsewhere
module.exports = Post;
