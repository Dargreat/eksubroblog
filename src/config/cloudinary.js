const cloudinary = require('cloudinary').v2;  // Import Cloudinary

// Load environment variables
require('dotenv').config();

// Set up Cloudinary with credentials from .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;  // Export for use in other parts of the app
