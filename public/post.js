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

function formatISODate(isoString) {
    const date = new Date(isoString);

    // Options for date and time formatting
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true // Use AM/PM format
    };

    return date.toLocaleString('en-US', options);
}

function renderPost(post) {
    console.log(post);

    document.title = `${post.title} | Eksu Bro Blog`;

    document.getElementById('postContent').innerHTML = `
    <div class="post-header" style="margin-bottom: 2rem; border-bottom: 1px solid #eaeaea; padding-bottom: 1.5rem;">
        <h1 class="post-title" style="font-size: 2.5rem; margin: 0 0 0.5rem 0; color: #333; font-weight: 700;">${post.title}</h1>
        <div class="post-meta" style="display: flex; gap: 1rem; color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;">
            <span class="post-date">${formatISODate(post.timestamp)}</span>
            <span class="post-author">By ${post.author || 'Eksu Bro'}</span>
        </div>
        ${post.imageUrl ? `
            <img src="${post.imageUrl}" 
                 alt="${post.title}" 
                 class="post-image"
                 style="width: 100%; max-height: 500px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                 onerror="this.style.display='none'">
        ` : ''}
    </div>
    <div class="post-content" style="font-size: 1.1rem; line-height: 1.6; color: #444; margin-bottom: 3rem;">
        ${post.content}
    </div>
    <section class="comments-section" style="background: #f9f9f9; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <h2 style="font-size: 1.5rem; margin-top: 0; margin-bottom: 1.5rem; color: #333;">Comments</h2>
        <div class="comment-form" style="margin-bottom: 2rem;">
            <form id="commentForm" style="display: flex; flex-direction: column; gap: 1rem;">
                <div class="form-group" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label for="commentAuthor" style="font-weight: 500; color: #555;">Your Name:</label>
                    <input 
                        type="text" 
                        id="commentAuthor" 
                        placeholder="Enter your name" 
                        required
                        style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; transition: border-color 0.2s;"
                        onfocus="this.style.borderColor='#888'; this.style.outline='none'"
                        onblur="this.style.borderColor='#ddd'">
                </div>
                <div class="form-group" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label for="commentText" style="font-weight: 500; color: #555;">Your Comment:</label>
                    <textarea 
                        id="commentText" 
                        placeholder="Add your comment..." 
                        required
                        rows="4"
                        style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; resize: vertical; min-height: 100px; transition: border-color 0.2s;"
                        onfocus="this.style.borderColor='#888'; this.style.outline='none'"
                        onblur="this.style.borderColor='#ddd'"></textarea>
                </div>
                <button 
                    type="submit" 
                    class="form-button"
                    style="background: #ff4757; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.1s; align-self: flex-start;"
                    onmouseover="this.style.background='#ff6b81'"
                    onmouseout="this.style.background='#ff4757'"
                    onmousedown="this.style.transform='scale(0.98)'"
                    onmouseup="this.style.transform='scale(1)'">
                    Post Comment
                </button>
            </form>
        </div>
        <div class="comment-list" id="commentList" style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${post.comments ? renderComments(post.comments) : '<p style="color: #777; font-style: italic;">No comments yet. Be the first to comment!</p>'}
        </div>
    </section>
`;

    // Fixed form submission handler with proper error handling
    document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const author = document.getElementById('commentAuthor').value;
        const content = document.getElementById('commentText').value;
        const commentList = document.getElementById('commentList');
        const button = e.target.querySelector('button[type="submit"]');

        if (!author || !content) {
            alert('Please fill in both name and comment fields');
            return;
        }

        try {
            // Show loading state
            button.disabled = true;
            button.textContent = 'Posting...';
            button.style.opacity = '0.8';

            // Post the comment
            const response = await fetch(`/api/posts/${post._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ author, content })
            });

            if (response.ok) {
                const newComment = await response.json();

                // Create and append the new comment directly
                const commentElement = document.createElement('div');
                commentElement.style.background = 'white';
                commentElement.style.padding = '1.5rem';
                commentElement.style.borderRadius = '6px';
                commentElement.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                commentElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: #ff4757;">${newComment.author}</strong>
                    <span style="color: #888; font-size: 0.85rem;">${formatISODate(newComment.timestamp)}</span>
                </div>
                <div style="color: #444; line-height: 1.5;">
                    ${newComment.content}
                </div>
            `;

                // If there's a "no comments" message, remove it
                if (commentList.querySelector('p')) {
                    commentList.innerHTML = '';
                }

                // Prepend the new comment
                commentList.prepend(commentElement);

                // Clear the form
                e.target.reset();
            } else {
                throw new Error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        } finally {
            // Reset button state
            button.disabled = false;
            button.textContent = 'Post Comment';
            button.style.opacity = '1';
        }
    });

    // Render comments function
    function renderComments(comments) {
        return comments.map(comment => `
        <div class="comment" style="background: white; padding: 1.5rem; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div class="comment-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong style="color: #ff4757;">${comment.author}</strong>
                <span style="color: #888; font-size: 0.85rem;">${formatISODate(comment.timestamp)}</span>
            </div>
            <div class="comment-content" style="color: #444; line-height: 1.5;">
                ${comment.content}
            </div>
        </div>
    `).join('');
    }
}

function renderComments(comments) {
    return comments.map(comment => `
        <div class="comment-card">
            <div class="comment-avatar">${comment.author.substring(0, 2).toUpperCase()}</div>
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
        <div class="comment-avatar">${comment.author.substring(0, 2).toUpperCase()}</div>
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
