// register.js
// Handles the registration form submission

const API_BASE = 'http://localhost:5000/api/auth';

const registerForm = document.getElementById('registerForm');
const messageBox = document.getElementById('messageBox');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // stop page from refreshing

    // Collect form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, 'success');
            // Redirect to login page after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showMessage(data.message, 'danger');
        }

    } catch (error) {
        showMessage('Could not connect to server. Is the backend running?', 'danger');
        console.error(error);
    }
});

// Helper function to show messages on screen
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `alert alert-${type}`; // alert-success or alert-danger
    messageBox.classList.remove('d-none');
}
