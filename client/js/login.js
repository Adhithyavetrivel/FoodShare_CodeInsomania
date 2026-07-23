// login.js
// Handles the login form submission

const API_BASE = 'http://localhost:5000/api/auth';

const loginForm = document.getElementById('loginForm');
const messageBox = document.getElementById('messageBox');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // IMPORTANT: allows cookie (JWT token) to be saved
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, 'success');
            // Save user info in browser storage so other pages can use it
            localStorage.setItem('user', JSON.stringify(data.user));

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message, 'danger');
        }

    } catch (error) {
        showMessage('Could not connect to server. Is the backend running?', 'danger');
        console.error(error);
    }
});

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `alert alert-${type}`;
    messageBox.classList.remove('d-none');
}
