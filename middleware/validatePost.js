function validatePost(req, res, next) {
    console.log(req.body);
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    next();
}

module.exports = validatePost;
