function renderPosts(posts) {
    const grid = document.getElementById('postsGrid');
    
    if (!posts || posts.length === 0) {
        grid.innerHTML = '<p class="no-posts">No articles found</p>';
        return;
    }

    grid.innerHTML = posts.map(post => {
        // Check if the post has a valid image
        const imageUrl = post.image || post.imageUrl; // Try both common image property names
        const isValidImage = imageUrl && 
                           (imageUrl.startsWith('http') || imageUrl.startsWith('/')) &&
                           !imageUrl.includes('default-image');

        // Use priority: 1. Post image 2. Default image
        const finalImageUrl = isValidImage ? imageUrl : 'https://adegbitejoshua.vercel.app/image.png';

        return `
        <article class="news-card">
            <img src="${finalImageUrl}" 
                 alt="${post.title || 'No title'}" 
                 class="news-image"
                 onerror="handleImageError(this)">
            <div class="news-content">
                <span class="news-date">
                    ${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}
                </span>
                <h3 class="news-title">${post.title || 'Untitled'}</h3>
                <p class="news-excerpt">
                    ${post.content ? post.content.substring(0, 200) + '...' : 'No content'}
                </p>
                <a href="post.html?id=${post._id || '#'}" class="read-more">Read More →</a>
            </div>
        </article>
        `;
    }).join('');
}

// Add this error handler function
function handleImageError(img) {
    console.error('Failed to load image:', img.src);
    img.src = 'https://adegbitejoshua.vercel.app/image.png';
    img.onerror = null; // Prevent infinite loop if default image fails
}
