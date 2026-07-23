// my-donations.js
// Fetches and displays the logged-in user's own donations on dashboard.html

const API_BASE = 'http://localhost:5000/api/donations';

async function loadMyDonations() {
    const tableBody = document.getElementById('myDonationsBody');

    try {
        const response = await fetch(`${API_BASE}/my`, {
            method: 'GET',
            credentials: 'include' // sends JWT cookie so backend knows who's asking
        });

        const data = await response.json();

        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${data.message}</td></tr>`;
            return;
        }

        if (data.donations.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">You haven't added any donations yet.</td></tr>`;
            return;
        }

        // Build table rows dynamically
        let rows = '';
        data.donations.forEach(donation => {
            rows += `
                <tr>
                    <td>${donation.food_name}</td>
                    <td>${donation.quantity}</td>
                    <td>${formatDate(donation.expiry_date)}</td>
                    <td>${donation.pickup_address}</td>
                    <td>${getStatusBadge(donation.status)}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = rows;

    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Could not connect to server.</td></tr>`;
        console.error(error);
    }
}

// Helper: format date nicely (YYYY-MM-DD -> readable format)
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Helper: colored badge based on status
function getStatusBadge(status) {
    if (status === 'available') return `<span class="badge bg-success">Available</span>`;
    if (status === 'requested') return `<span class="badge bg-warning text-dark">Requested</span>`;
    if (status === 'completed') return `<span class="badge bg-secondary">Completed</span>`;
    return status;
}

// Load donations as soon as this script runs
loadMyDonations();
