document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        document.getElementById('postsGrid').innerHTML = `
            <p class="error-message">Failed to load posts. Please refresh.</p>
        `;
    }
});

function renderPosts(posts) {
    const grid = document.getElementById('postsGrid');
    
    if (!posts || posts.length === 0) {
        grid.innerHTML = '<p class="no-posts">No articles found</p>';
        return;
    }

    grid.innerHTML = posts.map(post => `
        <article class="news-card">
            <img src="${post.imageUrl || 'placeholder.jpg'}" 
                 alt="${post.title}" 
                 class="news-image"
                 onerror="this.src='placeholder.jpg'">
            <div class="news-content">
                <span class="news-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                <h3 class="news-title">${post.title}</h3>
                <p class="news-excerpt">${post.content.substring(0, 200)}...</p>
                <a href="post.html?id=${post.id}" class="read-more">Read More →</a>
            </div>
        </article>
    `).join('');
}