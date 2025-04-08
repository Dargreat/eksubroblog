document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});

// Load all posts
async function loadPosts() {
  // Replace the local endpoint with the Vercel URL
  const response = await fetch('/api/posts');  // Vercel API endpoint
  if (!response.ok) {
    console.error('Failed to fetch posts:', response.statusText);
    return;
  }
  const posts = await response.json();
  
  let postsList = document.getElementById("postsList");
  postsList.innerHTML = "";

  posts.forEach(post => {
      postsList.innerHTML += `
          <div class="post">
              <h3>${post.title}</h3>
              <p><strong>Author:</strong> ${post.author} | <strong>Time:</strong> ${new Date(post.timestamp).toLocaleString()}</p>
              ${post.image ? `<img src="${post.image}" alt="Header Image">` : ""}
              <p>${post.content}</p>
              <div class="actions">
                  <button class="edit-btn" onclick="editPost('${post._id}')">Edit</button>
                  <button class="delete-btn" onclick="deletePost('${post._id}')">Delete</button>
              </div>
          </div>
      `;
  });
}

let id;

// Create or update a post
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // const id = document.getElementById("postId").value;
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("author", author);
  formData.append("content", content);
  if (image) formData.append("image", image);
  if (id) formData.append("id", id);

  const url = id ? `/api/posts/${id}` : '/api/posts';  // Update to Vercel URL
  const method = id ? "PATCH" : "POST";

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
}

  await fetch(url, { method, body: formData });

  document.getElementById("postForm").reset();
  document.getElementById("postId").value = "";
  id = null;
  loadPosts();
});

// Delete a post
async function deletePost(id) {
  if (confirm("Are you sure you want to delete this post?")) {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });  // Vercel URL
      loadPosts();
}
}

// Edit a post - populate form with existing data
async function editPost(postId) {
  try {
    // Show loading state
    const editBtn = document.querySelector(`.edit-btn[onclick="editPost('${postId}')"]`);
    if (editBtn) {
      editBtn.disabled = true;
      editBtn.textContent = 'Loading...';
    }

    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post data');
    }
    
    const post = await response.json();
    
    // Set the global id variable for form submission
    id = post._id;
    
    // Populate the form with the post data
    document.getElementById("title").value = post.title || '';
    document.getElementById("author").value = post.author || '';
    document.getElementById("content").value = post.content || '';
    
    // Show notification
    alert(`Post "${post.title}" loaded for editing. Make your changes and click Submit.`);
    
    // Scroll to the form for better UX
    document.getElementById("postForm").scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });

    // Focus on the title field for immediate editing
    document.getElementById("title").focus();

  } catch (error) {
    console.error('Error editing post:', error);
    alert('Failed to load post for editing. Please try again.');
  } finally {
    // Reset button state
    if (editBtn) {
      editBtn.disabled = false;
      editBtn.textContent = 'Edit';
    }
  }
}