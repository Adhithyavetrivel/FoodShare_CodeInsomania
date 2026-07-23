// admin.js
// Loads users, donations, and requests for the admin panel.
// Also handles switching between tabs.

const ADMIN_API = 'http://localhost:5000/api/admin';
const messageBox = document.getElementById('messageBox');

// ============================================
// Frontend role check (extra safety layer for UX)
// Real security is enforced by the backend (verifyAdmin middleware)
// ============================================
const currentUser = JSON.parse(localStorage.getItem('user'));

if (!currentUser || currentUser.role !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = 'index.html';
} else {
    // Only reveal the page if the user IS an admin
    document.body.style.display = 'block';
}

// ============================================
// Tab switching logic
// ============================================
const tabButtons = document.querySelectorAll('#adminTabs .nav-link');
const sections = {
    users: document.getElementById('usersSection'),
    donations: document.getElementById('donationsSection'),
    requests: document.getElementById('requestsSection')
};

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active tab styling
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Show the matching section, hide the others
        const targetTab = button.getAttribute('data-tab');
        Object.keys(sections).forEach(key => {
            sections[key].classList.toggle('d-none', key !== targetTab);
        });
    });
});

// ============================================
// Load Users
// ============================================
async function loadUsers() {
    const tbody = document.getElementById('usersBody');
    try {
        const response = await fetch(`${ADMIN_API}/users`, { credentials: 'include' });
        const data = await response.json();

        if (!response.ok) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${data.message}</td></tr>`;
            return;
        }

        if (data.users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No users found.</td></tr>`;
            return;
        }

        let rows = '';
        data.users.forEach(user => {
            rows += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || '-'}</td>
                    <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}">${user.role}</span></td>
                    <td>${formatDate(user.created_at)}</td>
                </tr>
            `;
        });
        tbody.innerHTML = rows;

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Could not connect to server.</td></tr>`;
        console.error(error);
    }
}

// ============================================
// Load Donations
// ============================================
async function loadDonations() {
    const tbody = document.getElementById('donationsBody');
    try {
        const response = await fetch(`${ADMIN_API}/donations`, { credentials: 'include' });
        const data = await response.json();

        if (!response.ok) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">${data.message}</td></tr>`;
            return;
        }

        if (data.donations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No donations found.</td></tr>`;
            return;
        }

        let rows = '';
        data.donations.forEach(donation => {
            rows += `
                <tr>
                    <td>${donation.id}</td>
                    <td>${donation.food_name}</td>
                    <td>${donation.quantity}</td>
                    <td>${formatDate(donation.expiry_date)}</td>
                    <td>${donation.pickup_address}</td>
                    <td>${donation.donor_name}</td>
                    <td><span class="badge bg-secondary">${donation.status}</span></td>
                </tr>
            `;
        });
        tbody.innerHTML = rows;

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Could not connect to server.</td></tr>`;
        console.error(error);
    }
}

// ============================================
// Load Requests
// ============================================
async function loadRequests() {
    const tbody = document.getElementById('requestsBody');
    try {
        const response = await fetch(`${ADMIN_API}/requests`, { credentials: 'include' });
        const data = await response.json();

        if (!response.ok) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${data.message}</td></tr>`;
            return;
        }

        if (data.requests.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No requests found.</td></tr>`;
            return;
        }

        let rows = '';
        data.requests.forEach(request => {
            rows += `
                <tr>
                    <td>${request.id}</td>
                    <td>${request.food_name}</td>
                    <td>${request.donor_name}</td>
                    <td>${request.receiver_name}</td>
                    <td><span class="badge bg-warning text-dark">${request.status}</span></td>
                    <td>${formatDate(request.created_at)}</td>
                </tr>
            `;
        });
        tbody.innerHTML = rows;

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Could not connect to server.</td></tr>`;
        console.error(error);
    }
}

// ============================================
// Helper
// ============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Load everything when page opens (all 3 tabs' data, so switching tabs is instant)
loadUsers();
loadDonations();
loadRequests();

