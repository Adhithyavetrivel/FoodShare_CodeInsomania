// adminMiddleware.js
// This must be used AFTER verifyToken, since it relies on req.user
// being already set by the token verification step.
// It blocks access if the logged-in user's role isn't 'admin'.

function verifyAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); // user is admin, continue to the actual route
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}

module.exports = verifyAdmin;