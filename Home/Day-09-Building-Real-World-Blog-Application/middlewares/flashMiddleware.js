// ═══════════════════════════════════════════════════════════════════════
// middlewares/flashMiddleware.js — GLOBAL TEMPLATE VARIABLES
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Makes flash messages and the current user available in EVERY EJS
// template automatically. Without this middleware, you'd have to
// manually pass these variables in every single res.render() call.
//
// HOW res.locals WORKS:
// res.locals is a special Express object. Any property you set on it
// is automatically accessible as a variable in ALL EJS views rendered
// during that request cycle. It's like "global variables for views."
//
//   res.locals.success_msg = ['Blog created!'];
//   → In EJS: <%= success_msg %>
//
//   res.locals.currentUser = { name: 'Admin', role: 'admin' };
//   → In EJS: <% if (currentUser) { %> Hello, <%= currentUser.name %> <% } %>
//
// HOW IT CONNECTS:
// server.js registers this: app.use(setFlashMessages);
// It runs on EVERY request, BEFORE any route handler executes.
//
// FLOW FOR A FLASH MESSAGE:
//   1. Controller: req.flash('success_msg', 'Blog created!');
//   2. Controller: res.redirect('/admin/posts');
//   3. New request comes in for /admin/posts
//   4. THIS MIDDLEWARE reads the flash from session → puts it in res.locals
//   5. Route handler renders the view
//   6. View accesses success_msg and displays a green notification
//   7. Flash message is now DELETED from session (one-time only)
//
// ═══════════════════════════════════════════════════════════════════════


export const setFlashMessages = (req, res, next) => {

    // ─────────────────────────────────────────────────────
    // Step 1: Read flash messages from session and pass to views
    // ─────────────────────────────────────────────────────
    // req.flash('type') does TWO things:
    //   1. Reads all messages of that type from the session
    //   2. Clears them from the session (so they don't repeat)
    // Returns an array of strings (empty array if no messages).

    res.locals.success_msg = req.flash('success_msg');
    // → Success notifications (green): "Blog created!", "Settings saved!"

    res.locals.error_msg = req.flash('error_msg');
    // → Error notifications (red): "Blog not found", "Access denied"

    res.locals.error = req.flash('error');
    // → Passport.js uses 'error' (not 'error_msg') for login failures
    // → We capture this separately so Passport errors show properly


    // ─────────────────────────────────────────────────────
    // Step 2: Pass the current user to all views
    // ─────────────────────────────────────────────────────
    // Passport attaches the logged-in user to req.user
    // (via deserializeUser in config/passport.js).
    // We expose it as 'currentUser' in all templates.

    res.locals.currentUser = req.user || null;
    // → If logged in:  { _id, name, email, role, avatar, bio, ... }
    // → If not logged in: null
    //
    // USAGE IN EJS VIEWS:
    //   <% if (currentUser) { %>
    //       Hello, <%= currentUser.name %>!
    //       <% if (currentUser.role === 'admin') { %>
    //           <a href="/admin">Dashboard</a>
    //       <% } %>
    //   <% } else { %>
    //       <a href="/login">Login</a>
    //   <% } %>


    // ─────────────────────────────────────────────────────
    // Step 3: Continue to the next middleware or route
    // ─────────────────────────────────────────────────────
    next();
};