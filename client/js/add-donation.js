// add-donation.js
// Handles submitting the "Add Donation" form

const API_BASE = 'http://localhost:5000/api/donations';

const donationForm = document.getElementById('donationForm');
const messageBox = document.getElementById('messageBox');

donationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const food_name = document.getElementById('food_name').value;
    const quantity = document.getElementById('quantity').value;
    const expiry_date = document.getElementById('expiry_date').value;
    const pickup_address = document.getElementById('pickup_address').value;

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // sends the JWT cookie along with request
            body: JSON.stringify({ food_name, quantity, expiry_date, pickup_address })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, 'success');
            donationForm.reset();
            // Redirect back to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);
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
