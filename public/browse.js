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
    const fallbackImage = 'https://adegbitejoshua.vercel.app/image.png';

    if (!posts || posts.length === 0) {
        grid.innerHTML = '<p class="no-posts">No articles found</p>';
        return;
    }

    grid.innerHTML = posts.map(post => {
        const imageUrl = post.imageUrl && post.imageUrl.trim() !== '' ? post.imageUrl : fallbackImage;

        return `
            <article class="news-card">
                <img src="${imageUrl}" 
                     alt="${post.title || 'No title'}" 
                     class="news-image"
                     onerror="this.onerror=null; this.src='${fallbackImage}'">
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
