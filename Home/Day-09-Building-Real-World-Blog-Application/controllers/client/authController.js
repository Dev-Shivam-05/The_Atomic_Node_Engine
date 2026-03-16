// ═══════════════════════════════════════════════════════════════════════
// controllers/client/authController.js — AUTHENTICATION CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles all authentication-related logic:
//   - Showing the login page
//   - Processing login (using Passport.js)
//   - Showing the registration page
//   - Processing registration (creating new user)
//   - Logging out
//
// THIS WAS THE FILE CAUSING YOUR CRASH:
// The import in clientRoutes.js expected a default export:
//   import authController from '../controllers/client/authController.js';
// But this file was empty → no default export → SyntaxError!
//
// THE COMPLETE LOGIN FLOW (how Passport integrates):
// ┌────────────────────────────────────────────────────────────┐
// │ 1. User visits /login → loginPage() renders the form      │
// │ 2. User submits form → POST /login                        │
// │ 3. login() calls passport.authenticate('local')           │
// │ 4. Passport runs the LocalStrategy (config/passport.js)   │
// │ 5. Strategy queries User model → compares password hash   │
// │ 6. If success: Passport serializes user → session created │
// │    → redirect to /admin (admin) or / (user)               │
// │ 7. If failure: flash message → redirect back to /login    │
// └────────────────────────────────────────────────────────────┘
//
// HOW IT CONNECTS:
// routes/clientRoutes.js:
//   GET  /login    → isGuest → authController.loginPage
//   POST /login    → authController.login
//   GET  /register → isGuest → authController.registerPage
//   POST /register → authController.register
//   GET  /logout   → authController.logout
//
// ═══════════════════════════════════════════════════════════════════════


// Step 1: Import required modules
import passport from 'passport';
// → We need passport here to call passport.authenticate() in the login handler

import User from '../../models/User.js';
// → We need the User model to create new users during registration


// Step 2: Define the controller object
const authController = {

    // ─────────────────────────────────────────────────────────
    // loginPage — Show the login form
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /login
    // MIDDLEWARE: isGuest (only non-logged-in users see this)

    loginPage: (req, res) => {
        res.render('client/pages/login', {
            title: 'Login',
            currentPage: 'login'
        });
        // → Renders views/client/pages/login.ejs
        // → Flash messages (success_msg, error_msg, error) are automatically
        //   available via the flashMiddleware (set in server.js Step 14)
    },


    // ─────────────────────────────────────────────────────────
    // login — Process the login form
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /login
    //
    // This is where Passport.js does its magic!
    // We call passport.authenticate('local', options) which triggers
    // the LocalStrategy we defined in config/passport.js.
    //
    // WHY this unusual pattern (function returning middleware)?
    // passport.authenticate() returns a middleware function.
    // But we need to customize the behavior (redirects, flash messages),
    // so we use the callback form and handle redirects ourselves.

    login: (req, res, next) => {

        // Step 3: Validate that both fields are filled
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error_msg', 'Please fill in both email and password.');
            return res.redirect('/login');
        }

        // Step 4: Call Passport's authenticate method
        passport.authenticate('local', {

            successRedirect: '/admin',
            // → On successful login, redirect to admin dashboard
            // → If user is not admin, the isAdmin middleware on /admin
            //   will catch this and redirect them appropriately

            failureRedirect: '/login',
            // → On failed login, redirect back to the login page

            failureFlash: true
            // → When authentication fails, Passport automatically calls
            //   req.flash('error', message) with the message from our
            //   LocalStrategy (e.g., "Incorrect password. Please try again.")
            // → This 'error' flash is captured by flashMiddleware and
            //   available in views as the 'error' variable

        })(req, res, next);
        // → IMPORTANT: The (req, res, next) at the end CALLS the middleware
        //   that passport.authenticate() returned.
        //   Without this, the middleware would be created but never executed!
    },


    // ─────────────────────────────────────────────────────────
    // registerPage — Show the registration form
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /register
    // MIDDLEWARE: isGuest (only non-logged-in users)

    registerPage: (req, res) => {
        res.render('client/pages/register', {
            title: 'Register',
            currentPage: 'register'
        });
    },


    // ─────────────────────────────────────────────────────────
    // register — Process the registration form
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /register
    //
    // FLOW:
    // 1. Extract form data (name, email, password, confirmPassword)
    // 2. Validate all fields
    // 3. Check if email already exists
    // 4. Create new user (password is auto-hashed by User model)
    // 5. Redirect to login page with success message

    register: async (req, res) => {
        try {
            // Step 5: Extract form data from request body
            const { name, email, password, confirmPassword } = req.body;

            // Step 6: Validation — collect all errors before responding
            const errors = [];

            // Step 6a: Check all required fields are present
            if (!name || !email || !password || !confirmPassword) {
                errors.push('All fields are required.');
            }

            // Step 6b: Check password length
            if (password && password.length < 6) {
                errors.push('Password must be at least 6 characters.');
            }

            // Step 6c: Check passwords match
            if (password !== confirmPassword) {
                errors.push('Passwords do not match.');
            }

            // Step 6d: Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                errors.push('Please enter a valid email address.');
            }

            // Step 7: If there are validation errors, flash them and redirect back
            if (errors.length > 0) {
                errors.forEach(error => req.flash('error_msg', error));
                // → Each error becomes a separate flash message
                return res.redirect('/register');
            }

            // Step 8: Check if a user with this email already exists
            const existingUser = await User.findOne({ email: email.toLowerCase() });

            if (existingUser) {
                req.flash('error_msg', 'An account with this email already exists. Please login instead.');
                return res.redirect('/register');
            }

            // Step 9: Create the new user
            await User.create({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password
                // → The password will be automatically hashed by the
                //   pre-save hook in models/User.js (Step 2 of that file)
                // → role defaults to 'user' (from the schema)
            });

            // Step 10: Success — redirect to login page
            req.flash('success_msg', 'Registration successful! You can now log in.');
            res.redirect('/login');

        } catch (error) {
            console.error('Registration Error:', error.message);

            // Step 11: Handle duplicate key error (unique email constraint)
            if (error.code === 11000) {
                // → MongoDB error code 11000 = duplicate key violation
                req.flash('error_msg', 'An account with this email already exists.');
            } else {
                req.flash('error_msg', 'Registration failed. Please try again.');
            }
            res.redirect('/register');
        }
    },


    // ─────────────────────────────────────────────────────────
    // logout — Log the user out
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /logout
    //
    // WHAT HAPPENS:
    // 1. Passport's req.logout() clears the user from the session
    // 2. The session is destroyed (all session data deleted)
    // 3. User is redirected to login page with success message

    logout: (req, res) => {
        // Step 12: Call Passport's logout method
        req.logout((err) => {
            // → req.logout() requires a callback in Passport v0.6+
            // → It removes req.user and clears the login session

            if (err) {
                console.error('Logout Error:', err.message);
                req.flash('error_msg', 'Error logging out. Please try again.');
                return res.redirect('/');
            }

            // Step 13: Destroy the entire session for clean logout
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    console.error('Session Destroy Error:', destroyErr.message);
                }

                // Step 14: Redirect to login page with success message
                // NOTE: We can't use req.flash() here because the session
                // is already destroyed. Instead, we use a query parameter.
                res.redirect('/login');
            });
        });
    }
};


// Step 15: Export as default — THIS FIXES YOUR CRASH!
// clientRoutes.js imports: import authController from '...'
// Without this line, Node.js throws:
//   "does not provide an export named 'default'"
export default authController;