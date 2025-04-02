const express = require('express');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const imageRoutes = require('./routes/imageRoutes');  // Import image routes
const multer = require('multer');  // To handle file uploads
require('dotenv').config();

// Connect to the database
connectDB();

const app = express();
app.use(express.json());  // To parse incoming JSON data
app.use(express.urlencoded({ extended: true }));  // To parse incoming URL-encoded data

// Set up routes
app.use('/api/posts', postRoutes);  // Handle post-related routes
app.use('/api/posts/:postId/comments', commentRoutes);  // Handle comment-related routes
app.use('/api/images', imageRoutes);  // Handle image uploads

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
