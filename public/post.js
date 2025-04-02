let postId; // Declare globally for access in all functions

document.addEventListener('DOMContentLoaded', async () => {
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    postId = urlParams.get('id');
    
    if (!postId) {
        document.getElementById('postContent').innerHTML = `
            <p class="error-message">Post not found. <a href="/browse.html">Browse all posts</a></p>
        `;
        return;
    }

    try {
        // Fetch post data
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) throw new Error('Post not found');
        
        const post = await response.json();
        renderPost(post);
    } catch (error) {
        document.getElementById('postContent').innerHTML = `
            <p class="error-message">${error.message}. <a href="/browse.html">Browse all posts</a></p>
        `;
    }
});

function renderPost(post) {
    document.title = `${post.title} | Eksu Bro Blog`;
    
    document.getElementById('postContent').innerHTML = `
        <div class="post-header">
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                <span class="post-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                <span class="post-author">By ${post.author || 'Eksu Bro'}</span>
            </div>
            ${post.imageUrl ? `
                <img src="${post.imageUrl}" 
                     alt="${post.title}" 
                     class="post-image"
                     onerror="this.style.display='none'">
            ` : ''}
        </div>
        <div class="post-content">
            ${post.content}
        </div>
        <section class="comments-section">
            <h2>Comments</h2>
            <div class="comment-form">
                <form id="commentForm">
                    <textarea placeholder="Add your comment..." required></textarea>
                    <button type="submit" class="form-button">Post Comment</button>
                </form>
            </div>
            <div class="comment-list" id="commentList">
                ${post.comments ? renderComments(post.comments) : '<p>No comments yet.</p>'}
            </div>
        </section>
    `;

    // Setup comment form
    document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = e.target.querySelector('textarea').value.trim();
        if (!content) return;

        try {
            // Submit to API
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            
            if (!response.ok) throw new Error('Failed to post comment');
            const newComment = await response.json();
            document.getElementById('commentList').prepend(createCommentElement(newComment));
            e.target.reset();
        } catch (error) {
            alert('Failed to post comment');
        }
    });
}

function renderComments(comments) {
    return comments.map(comment => `
        <div class="comment-card">
            <div class="comment-avatar">${comment.author.substring(0,2).toUpperCase()}</div>
            <div class="comment-content">
                <div class="comment-author">
                    <span class="author-name">${comment.author}</span>
                    <span class="comment-time">${new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p class="comment-text">${comment.content}</p>
            </div>
        </div>
    `).join('');
}

function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-card';
    div.innerHTML = `
        <div class="comment-avatar">${comment.author.substring(0,2).toUpperCase()}</div>
        <div class="comment-content">
            <div class="comment-author">
                <span class="author-name">${comment.author}</span>
                <span class="comment-time">Just now</span>
            </div>
            <p class="comment-text">${comment.content}</p>
        </div>
    `;
    return div;
}
