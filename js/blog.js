document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});

async function loadBlogPosts() {
    try {
        const response = await fetch('/posts/index.json');
        const posts = await response.json();
        displayBlogPosts(posts);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        displayErrorMessage();
    }
}

function displayBlogPosts(posts) {
    const blogPostsSection = document.querySelector('.blog-posts');
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        blogPostsSection.appendChild(postElement);
    });
}

function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    
    article.innerHTML = `
        <h2>${post.title}</h2>
        <div class="blog-post-meta">
            <span class="date">${new Date(post.date).toLocaleDateString()}</span>
        </div>
        <div class="blog-post-content">
            ${post.excerpt || post.content.substring(0, 200) + '...'}
        </div>
        <a href="${post.url}" class="read-more">Read more</a>
    `;
    
    return article;
}

function displayErrorMessage() {
    const blogPostsSection = document.querySelector('.blog-posts');
    blogPostsSection.innerHTML = `
        <div class="error-message">
            <p>Sorry, we couldn't load the blog posts at this time. Please try again later.</p>
        </div>
    `;
} 