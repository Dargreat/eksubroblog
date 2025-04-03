import dbConnect from '../config/db';
import Post from '../models/Post';

export default async function handler(req, res) {
    await dbConnect();  // Connect to MongoDB

    if (req.method === 'GET') {
        const posts = await Post.find();
        return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
        const { title, author, content, imageUrl } = req.body;
        const newPost = new Post({ title, author, content, imageUrl });
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
