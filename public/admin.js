document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});

// Load all posts
async function loadPosts() {
  const response = await fetch('/api/posts');
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
                  <button class="edit-btn" onclick="editPost('${post.id}')">Edit</button>
                  <button class="delete-btn" onclick="deletePost('${post.id}')">Delete</button>
              </div>
          </div>
      `;
  });
}

// Create or update a post
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("postId").value;
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("author", author);
  formData.append("content", content);
  if (image) formData.append("image", image);

  const url = id ? `/api/posts/${id}` : '/api/posts';
  const method = id ? "PUT" : "POST";

  await fetch(url, { method, body: formData });

  document.getElementById("postForm").reset();
  document.getElementById("postId").value = "";
  loadPosts();
});

// Delete a post
async function deletePost(id) {
  if (confirm("Are you sure you want to delete this post?")) {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      loadPosts();
  }
}
fetch('/api/posts')
  .then(response => {
    if (!response.ok) {
      // If the response is not ok (404, 500, etc.), throw an error
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();  // Parse the JSON only if the response is OK
  })
  .then(data => {
    // Handle the parsed JSON data here
    console.log(data);  // Display the posts data (or whatever your endpoint returns)
  })
  .catch(error => {
    // Log any errors that occur
    console.error('There was a problem with the fetch operation:', error);
  });
