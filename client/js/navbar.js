// navbar.js
// This script builds a common navbar for all pages
// and shows/hides links based on whether user is logged in.
// It reads user info from localStorage (saved during login).

function loadNavbar() {
    const navbarContainer = document.getElementById('navbarContainer');
    const user = JSON.parse(localStorage.getItem('user')); // null if not logged in

    let navLinks = '';

    if (user) {
        // Logged-in menu
        navLinks = `
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="donations.html">All Donations</a></li>
            <li class="nav-item"><a class="nav-link" href="dashboard.html">My Dashboard</a></li>
        `;

        // Show Admin link only if role is admin
        if (user.role === 'admin') {
            navLinks += `<li class="nav-item"><a class="nav-link" href="admin.html">Admin Panel</a></li>`;
        }

        navLinks += `
            <li class="nav-item"><span class="nav-link text-light">Hi, ${user.name}</span></li>
            <li class="nav-item"><a class="nav-link" href="#" id="logoutBtn">Logout</a></li>
        `;
    } else {
        // Logged-out menu
        navLinks = `
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="donations.html">All Donations</a></li>
            <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="register.html">Register</a></li>
        `;
    }

    navbarContainer.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-success">
            <div class="container">
                <a class="navbar-brand" href="index.html">🍲 FoodShare</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        ${navLinks}
                    </ul>
                </div>
            </div>
        </nav>
    `;

    // Attach logout event AFTER navbar HTML is inserted
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
}

// Run navbar loading as soon as script loads
loadNavbar();
