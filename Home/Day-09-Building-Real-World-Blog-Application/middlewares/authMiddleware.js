// ═══════════════════════════════════════════════════════════════════════
// middlewares/authMiddleware.js — ROUTE PROTECTION GUARDS
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Provides three middleware functions that control WHO can access
// which routes. Think of them as security guards at different doors.
//
// HOW MIDDLEWARE WORKS IN EXPRESS:
// ┌──────────────────────────────────────────────────────┐
// │ Request → [Middleware] → If OK → next() → Handler   │
// │                        → If NOT → redirect/block     │
// └──────────────────────────────────────────────────────┘
//
// THREE GUARDS:
//   1. isAuthenticated → Only LOGGED-IN users pass
//   2. isAdmin         → Only ADMIN users pass
//   3. isGuest         → Only NON-LOGGED-IN users pass
//
// HOW THEY'RE USED IN ROUTES:
//   router.get('/admin', isAdmin, controller);           // Admin only
//   router.post('/comment', isAuthenticated, controller); // Any logged-in user
//   router.get('/login', isGuest, controller);            // Only guests
//
// HOW IT CONNECTS:
//   routes/adminRoutes.js → uses isAdmin on ALL admin routes
//   routes/clientRoutes.js → uses isAuthenticated for comments
//   routes/clientRoutes.js → uses isGuest for login/register
//
// ═══════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
// Guard 1: isAuthenticated — Only logged-in users
// ─────────────────────────────────────────────────────────────
// USE CASE: Posting comments, accessing user profile
//
// HOW: Passport.js adds req.isAuthenticated() to every request.
// It returns true if the user has a valid session (logged in).

export const isAuthenticated = (req, res, next) => {
    // Step 1: Check if user is logged in
    if (req.isAuthenticated()) {
        // Step 2a: YES → let them through to the route handler
        return next();
    }

    // Step 2b: NO → redirect to login with error message
    req.flash('error_msg', 'Please log in to access this page.');
    res.redirect('/login');
};


// ─────────────────────────────────────────────────────────────
// Guard 2: isAdmin — Only admin users
// ─────────────────────────────────────────────────────────────
// USE CASE: Entire admin dashboard (/admin/*)
//
// CHECKS TWO CONDITIONS:
//   1. Is the user logged in?
//   2. Does the user have role === 'admin'?
// Both must be true to pass.

export const isAdmin = (req, res, next) => {
    // Step 1: Check both conditions
    if (req.isAuthenticated() && req.user.role === 'admin') {
        // Step 2a: Logged in AND is admin → allow access
        return next();
    }

    // Step 2b: Either not logged in or not admin → block
    req.flash('error_msg', 'Access denied. Admin privileges required.');
    res.redirect('/login');
};


// ─────────────────────────────────────────────────────────────
// Guard 3: isGuest — Only non-logged-in users
// ─────────────────────────────────────────────────────────────
// USE CASE: Login page, registration page
//
// WHY: If someone is already logged in, showing them a login form
// is confusing. We redirect them to an appropriate page instead.

export const isGuest = (req, res, next) => {
    // Step 1: Check if user is NOT logged in
    if (!req.isAuthenticated()) {
        // Step 2a: Not logged in (is a guest) → show login/register form
        return next();
    }

    // Step 2b: Already logged in → redirect based on role
    if (req.user.role === 'admin') {
        return res.redirect('/admin');
        // → Admins go to the admin dashboard
    }
    res.redirect('/');
    // → Regular users go to the home page
};