// auth-guard.js
// Include this script on any page that requires the user to be logged in.
// It checks localStorage for user info. If missing, redirect to login.
//
// Note: This is a simple, beginner-friendly frontend check.
// The REAL security is enforced on the backend (authMiddleware.js),
// since anyone could clear/edit localStorage. This script just
// improves user experience by redirecting early.

const currentUser = JSON.parse(localStorage.getItem('user'));

if (!currentUser) {
    alert('Please login first to access this page.');
    window.location.href = 'login.html';
} else {
    // Show welcome message with the user's name if the element exists
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) {
        welcomeText.textContent = `Welcome, ${currentUser.name} 👋`;
    }
}