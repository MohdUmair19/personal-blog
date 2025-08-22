// Shared Data
let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// DOM Elements
const blogsContainer = document.getElementById('blogs-container');
const editorContainer = document.getElementById('editor-container');
const loginForm = document.getElementById('login-form');
const addBlogBtn = document.getElementById('add-blog-btn');
const navbar = document.getElementById('navbar');
const welcomeBanner = document.getElementById('welcome-banner');

// ===============================
// Navbar: dynamic based on login
// ===============================
if (navbar) {
    if (isLoggedIn) {
        navbar.innerHTML = `
            <a href="index.html">Home</a>
            <a href="editor.html">Editor</a>
            <a href="#" id="logout-link">Logout</a>
            <button id="dark-mode-toggle">Dark Mode</button>
        `;
    } else {
        navbar.innerHTML = `
            <a href="index.html">Home</a>
            <a href="login.html" id="login-link">Login</a>
            <button id="dark-mode-toggle">Dark Mode</button>
        `;
    }
}

// ===============================
// Login + Signup Functionality
// ===============================
if (loginForm) {
    const signupBtn = document.getElementById('signup-btn');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            window.location.href = 'editor.html';
        } else {
            alert('Invalid credentials. Please try again or sign up.');
        }
    });

    signupBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.username === username)) {
            alert('Username already exists!');
            return;
        }

        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created! You can now log in.');
    });
}

// ===============================
// Logout Functionality
// ===============================
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-link") {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    }
});

// ===============================
// Display Blogs on Home
// ===============================
function displayBlogs() {
    if (blogsContainer) {
        blogsContainer.innerHTML = '';
        blogs
            .filter(blog => blog.isPublished)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach(blog => {
                const blogDiv = document.createElement('div');
                blogDiv.classList.add('blog');
                
                blogDiv.innerHTML = `
                    <h3 style="color: #4CAF50; margin-bottom: 0.5rem;">${blog.title}</h3>
                    <p style="line-height: 1.8; font-size: calc(1rem + 0.5vw); color: #333; margin-bottom: 1rem;">
                        ${blog.content}
                    </p>
                    <small style="display: block; text-align: right; font-size: 0.9rem; color: #888;">
                        <strong>Published:</strong> ${blog.date}
                    </small>
                `;
                
                blogDiv.style.background = 'linear-gradient(135deg, #f9f9f9, #e6f7ff)';
                blogDiv.style.border = '1px solid #ddd';
                blogDiv.style.borderRadius = '10px';
                blogDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                blogDiv.style.padding = '1.5rem';
                blogDiv.style.marginBottom = '1.5rem';

                blogsContainer.appendChild(blogDiv);
            });
    }
}

// ===============================
// Manage Blogs in Editor
// ===============================
function manageBlogs() {
    if (editorContainer) {
        editorContainer.innerHTML = '';
        blogs.forEach((blog, index) => {
            const blogForm = document.createElement('div');
            blogForm.classList.add('blog');
            blogForm.innerHTML = `
                <input type="text" value="${blog.title}" id="title-${index}" />
                <textarea id="content-${index}">${blog.content}</textarea>
                <button class="save-btn" onclick="saveBlog(${index})">Save</button>
                <button class="publish-btn" onclick="publishBlog(${index})">Publish</button>
                <button class="delete-btn" onclick="deleteBlog(${index})">Delete</button>
            `;
            editorContainer.appendChild(blogForm);
        });
    }
}

// Save Blog
function saveBlog(index) {
    const title = document.getElementById(`title-${index}`).value;
    const content = document.getElementById(`content-${index}`).value;

    blogs[index].title = title;
    blogs[index].content = content;
    localStorage.setItem('blogs', JSON.stringify(blogs));
    alert('Blog saved successfully!');
}

// Publish Blog
function publishBlog(index) {
    blogs[index].isPublished = true;
    blogs[index].date = new Date().toLocaleString();
    localStorage.setItem('blogs', JSON.stringify(blogs));
    alert('Blog published successfully!');
    manageBlogs();
    displayBlogs();
}

// Delete Blog
function deleteBlog(index) {
    blogs.splice(index, 1);
    localStorage.setItem('blogs', JSON.stringify(blogs));
    manageBlogs();
}

// Add New Blog
if (addBlogBtn) {
    addBlogBtn.addEventListener('click', () => {
        blogs.push({ title: 'New Blog', content: 'Blog content here...', isPublished: false, date: '' });
        localStorage.setItem('blogs', JSON.stringify(blogs));
        manageBlogs();
    });
}

// ===============================
// Initial Page Load
// ===============================
if (blogsContainer) displayBlogs();
if (editorContainer) manageBlogs();

// ===============================
// Dark Mode
// ===============================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    const btn = document.getElementById('dark-mode-toggle');
    if (btn) btn.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('dark-mode-toggle');
    if (btn) btn.textContent = 'Light Mode';
}

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "dark-mode-toggle") {
        toggleDarkMode();
    }
});

// ===============================
// Interactive Messages
// ===============================
const blogSectionTitle = document.querySelector('#blog-section h2');
if (blogSectionTitle) {
    const user = localStorage.getItem('currentUser');
    if (isLoggedIn && user) {
        blogSectionTitle.textContent = `Welcome back, ${user}! 🎉 Here are your blogs`;
    } else {
        blogSectionTitle.textContent = 'Discover amazing stories below 👇';
    }
}

if (welcomeBanner) {
    const user = localStorage.getItem('currentUser');
    if (isLoggedIn && user) {
        welcomeBanner.textContent = `Welcome, ${user}! ✍️ Ready to write?`;
    }
}
