// main.js - Frontend Logic
import { getLatestPosts } from './api.js'; // Update with your actual API module

document.addEventListener('DOMContentLoaded', async () => {
  // Load posts from the backend
  try {
    const posts = await getLatestPosts(); // Replace with your actual API call
    populateLatestPosts(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  setupAnimations();
  setupCommentForm();
  setupSmoothScroll();
});

function populateLatestPosts(posts) {
  const grid = document.getElementById('newsGrid');
  if (!posts || posts.length === 0) {
    grid.innerHTML = '<p>No articles found.</p>';
    return;
  }
  grid.innerHTML = posts.map(post => `
    <article class="news-card">
      <img src="uploads/${post.featured_image || 'placeholder.jpg'}" 
           alt="${post.title}" 
           class="news-image">
      <div class="news-content">
        <span class="news-date">${new Date(post.created_at).toLocaleDateString()}</span>
        <h3 class="news-title">${post.title}</h3>
        <p class="news-excerpt">${post.content.substring(0, 200)}...</p>
        <a href="post.html?id=${post.id}" class="read-more">Read More →</a>
      </div>
    </article>
  `).join('');
}

function setupAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.hero-content, .about-content, .news-card, .comment-card, .footer-section'
  ).forEach(element => observer.observe(element));
}

function setupCommentForm() {
  const commentForm = document.getElementById('commentForm');
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(commentForm);
    const name = formData.get('name');
    const comment = formData.get('comment');
    
    // Connect this to your backend API to store the comment
    try {
      // Example: await postComment({ name, comment });
      // Once the comment is successfully stored, update the comment list.
      addCommentToList(name, comment);
      commentForm.reset();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  });
}

function addCommentToList(name, comment) {
  const commentList = document.getElementById('commentList');
  const newComment = document.createElement('article');
  newComment.className = 'comment-card';
  newComment.innerHTML = `
    <div class="comment-avatar">${name.substring(0, 2).toUpperCase()}</div>
    <div class="comment-content">
      <div class="comment-author">
        <span class="author-name">${name}</span>
        <span class="comment-time">Just now</span>
      </div>
      <p class="comment-text">${comment}</p>
    </div>
  `;
  commentList.prepend(newComment);
}

function setupSmoothScroll() {
  document.querySelectorAll('.footer-link a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
