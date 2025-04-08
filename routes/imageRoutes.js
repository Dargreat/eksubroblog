const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();  // We are using memory storage to keep the file temporarily in memory
const upload = multer({ storage: storage });

// Upload image to Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Create a readable stream from the buffer
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null); // End the stream

        // Upload the image to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' }, // Automatically detect the file type
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                }

                // Send back the image URL to the client
                res.status(200).json({ imageUrl: result.secure_url });
            }
        );

        // Pipe the image buffer to Cloudinary's upload stream
        bufferStream.pipe(uploadStream);

    } catch (err) {
        res.status(500).json({ error: 'Image upload failed' });
    }
});

module.exports = router;
