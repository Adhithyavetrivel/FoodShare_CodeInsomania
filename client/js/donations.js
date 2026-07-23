// donations.js
// Loads all available donations and lets logged-in users request them.

const DONATIONS_API = 'http://localhost:5000/api/donations';
const REQUESTS_API = 'http://localhost:5000/api/requests';

const donationsContainer = document.getElementById('donationsContainer');
const messageBox = document.getElementById('messageBox');

// Get currently logged-in user (if any) to know their id/role
const currentUser = JSON.parse(localStorage.getItem('user'));

// ============================================
// Load and display all donations
// ============================================
async function loadDonations() {
    try {
        const response = await fetch(DONATIONS_API);
        const data = await response.json();

        if (!response.ok) {
            donationsContainer.innerHTML = `<p class="text-center text-danger">${data.message}</p>`;
            return;
        }

        if (data.donations.length === 0) {
            donationsContainer.innerHTML = `<p class="text-center text-muted">No donations posted yet.</p>`;
            return;
        }

        // Build a Bootstrap card for each donation
        let cardsHtml = '';
        data.donations.forEach(donation => {
            cardsHtml += buildDonationCard(donation);
        });

        donationsContainer.innerHTML = cardsHtml;

        // After cards are inserted, attach click events to all "Request" buttons
        attachRequestButtonEvents();

    } catch (error) {
        donationsContainer.innerHTML = `<p class="text-center text-danger">Could not connect to server.</p>`;
        console.error(error);
    }
}

// ============================================
// Build the HTML for a single donation card
// ============================================
function buildDonationCard(donation) {
    const isAvailable = donation.status === 'available';

    // Decide what the button should say/do based on login state and status
    let actionButton = '';

    if (!currentUser) {
        // Not logged in — prompt to login
        actionButton = `<a href="login.html" class="btn btn-outline-success btn-sm w-100">Login to Request</a>`;
    } else if (!isAvailable) {
        // Already requested/completed by someone
        actionButton = `<button class="btn btn-secondary btn-sm w-100" disabled>Not Available</button>`;
    } else {
        // Available and user is logged in — show request button
        actionButton = `<button class="btn btn-success btn-sm w-100 requestBtn" data-id="${donation.id}">Request This Donation</button>`;
    }

    return `
        <div class="col-md-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${donation.food_name}</h5>
                    <p class="card-text mb-1"><strong>Quantity:</strong> ${donation.quantity}</p>
                    <p class="card-text mb-1"><strong>Expiry:</strong> ${formatDate(donation.expiry_date)}</p>
                    <p class="card-text mb-1"><strong>Pickup:</strong> ${donation.pickup_address}</p>
                    <p class="card-text mb-2"><strong>Donor:</strong> ${donation.donor_name}</p>
                    <span class="badge ${isAvailable ? 'bg-success' : 'bg-secondary'} mb-2">${donation.status}</span>
                    ${actionButton}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Attach click handlers to all "Request" buttons
// ============================================
function attachRequestButtonEvents() {
    const requestButtons = document.querySelectorAll('.requestBtn');

    requestButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const donationId = button.getAttribute('data-id');
            await sendRequest(donationId);
        });
    });
}

// ============================================
// Send the request to the backend
// ============================================
async function sendRequest(donationId) {
    try {
        const response = await fetch(REQUESTS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ donation_id: donationId })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, 'success');
            loadDonations(); // reload list so status updates immediately
        } else {
            showMessage(data.message, 'danger');
        }

    } catch (error) {
        showMessage('Could not connect to server.', 'danger');
        console.error(error);
    }
}

// ============================================
// Helpers
// ============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `alert alert-${type}`;
    messageBox.classList.remove('d-none');
    // Auto-hide after 3 seconds
    setTimeout(() => messageBox.classList.add('d-none'), 3000);
}

// Load donations as soon as the page opens
loadDonations();

