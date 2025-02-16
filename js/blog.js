document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});

async function loadBlogPosts() {
    try {
        // Fetch the list of markdown files
        const response = await fetch('/posts/content/');
        const files = await response.text();
        
        // Parse the directory listing to find .md files
        const mdFiles = [...files.matchAll(/href="([^"]+\.md)"/g)]
            .map(match => match[1])
            .filter(file => file.endsWith('.md'));
        
        await displayBlogPosts(mdFiles);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        displayErrorMessage();
    }
}

async function loadMarkdownContent(url) {
    const response = await fetch(url);
    const markdown = await response.text();
    return {
        content: marked.parse(markdown),
        title: extractTitle(markdown),
        date: new Date((await response.headers.get('last-modified')) || Date.now())
    };
}

function extractTitle(markdown) {
    // Extract the first heading from the markdown content
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : 'Untitled Post';
}

async function displayBlogPosts(posts) {
    const blogPostsSection = document.querySelector('.blog-posts');
    blogPostsSection.innerHTML = ''; // Clear existing posts
    
    for (const post of posts) {
        const article = document.createElement('article');
        article.className = 'blog-post';
        
        // Load and parse the Markdown content
        const content = await loadMarkdownContent(post.file);
        
        article.innerHTML = `
            <h2>${post.title}</h2>
            <div class="blog-post-meta">
                <span class="date">${new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div class="blog-post-content">
                ${content}
            </div>
        `;
        
        blogPostsSection.appendChild(article);
    }
}

function displayErrorMessage() {
    const blogPostsSection = document.querySelector('.blog-posts');
    blogPostsSection.innerHTML = `
        <div class="error-message">
            <p>Sorry, we couldn't load the blog posts at this time. Please try again later.</p>
        </div>
    `;
} 