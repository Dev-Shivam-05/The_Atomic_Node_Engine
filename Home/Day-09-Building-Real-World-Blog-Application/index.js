// ═══════════════════════════════════════════════════════════════════════════
// server.js — MAIN ENTRY POINT (The Heart of the Application)
// ═══════════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// This is the FIRST file that runs when you type "npm run dev".
// Think of it as the "main switchboard" — it wires everything together:
//   → Loads environment secrets (.env)
//   → Connects to the database
//   → Creates the Express web server
//   → Sets up sessions, authentication (Passport.js), flash messages
//   → Mounts all routes (client + admin)
//   → Starts listening for incoming HTTP requests
//
// THE BIG PICTURE — How a request flows through the app:
//   Browser Request → server.js → Middleware Chain → Route Match
//   → Controller Logic → Database Query (Model) → Render View (EJS)
//   → HTML Response sent back to Browser
//
// ═══════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
// Step 1: Load environment variables FIRST (before anything else)
// ─────────────────────────────────────────────────────────────
// WHY: `dotenv/config` reads the .env file and populates process.env
// with all the key-value pairs. Other files depend on these values
// (like the database URL), so this MUST run before any imports that
// use process.env.
//
// ES MODULE NOTE: In CommonJS you'd write require('dotenv').config().
// With ES Modules, importing 'dotenv/config' auto-calls .config().
import 'dotenv/config';


// ─────────────────────────────────────────────────────────────
// Step 2: Import all required npm packages
// ─────────────────────────────────────────────────────────────
// Each package has a specific job in our application:

import express from 'express';
// → Express is the web framework. It receives HTTP requests (GET, POST)
//   and sends back responses (HTML pages, JSON, redirects).

import path from 'path';
// → Built-in Node.js module for working with file/folder paths.
//   Ensures paths work correctly on Windows (\) and Mac/Linux (/).

import { fileURLToPath } from 'url';
// → ES Modules don't have __dirname (unlike CommonJS).
//   fileURLToPath converts import.meta.url to a file path,
//   which we then use to reconstruct __dirname.

import session from 'express-session';
// → Creates "sessions" — a mechanism to remember users between pages.
//   HTTP is stateless (the server forgets you after each request).
//   Sessions fix this by assigning each visitor a unique ID stored in a cookie.

import passport from 'passport';
// → Passport.js handles authentication (login/logout).
//   It verifies email/password and tracks who's logged in via sessions.

import flash from 'connect-flash';
// → Creates one-time notification messages ("Blog created!", "Wrong password!").
//   Messages appear once on the next page, then vanish on refresh.
//   Requires sessions to work (stores messages temporarily in the session).


// ─────────────────────────────────────────────────────────────
// Step 3: Import our custom project files
// ─────────────────────────────────────────────────────────────
// These are files WE created to keep the code organized (MVC pattern).
//
// ES MODULE NOTE: When importing local files, you MUST include the
// file extension (.js). CommonJS didn't require this, but ES Modules do.

import connectDB from './config/db.js';
// → Function that connects our app to MongoDB.

import configurePassport from './config/passport.js';
// → Function that sets up HOW Passport verifies users (Local Strategy).

import clientRoutes from './routes/clientRoutes.js';
// → All public website routes: /, /blog, /about, /login, etc.

import adminRoutes from './routes/adminRoutes.js';
// → All admin dashboard routes: /admin, /admin/posts, etc.

import { setFlashMessages } from './middlewares/flashMiddleware.js';
// → Middleware that passes flash messages & user data to ALL views.


// ─────────────────────────────────────────────────────────────
// Step 4: Reconstruct __dirname for ES Modules
// ─────────────────────────────────────────────────────────────
// WHY: In CommonJS (require), Node.js provides __dirname automatically.
// In ES Modules (import), it doesn't exist. We must reconstruct it.
//
// import.meta.url = the URL of THIS file (e.g., "file:///home/user/blog-app/server.js")
// fileURLToPath() = converts that URL to a normal path ("/home/user/blog-app/server.js")
// path.dirname()  = extracts the directory ("/home/user/blog-app")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ─────────────────────────────────────────────────────────────
// Step 5: Create the Express application
// ─────────────────────────────────────────────────────────────
// This creates the web server instance. Everything else is
// configured ON this object (middleware, routes, settings).
const app = express();


// ─────────────────────────────────────────────────────────────
// Step 6: Connect to MongoDB database
// ─────────────────────────────────────────────────────────────
// WHY: The app needs a database to store blogs, users, comments.
// This async function (in config/db.js) connects using MONGODB_URI.
// If it fails, the app exits (no point running without a database).
connectDB();


// ─────────────────────────────────────────────────────────────
// Step 7: Configure Passport authentication strategy
// ─────────────────────────────────────────────────────────────
// WHY: Passport needs to know HOW to verify users before it can
// authenticate anyone. This function (in config/passport.js) sets up
// the "Local Strategy" = verify using email + password from our database.
configurePassport(passport);


// ─────────────────────────────────────────────────────────────
// Step 8: Set up the View Engine (EJS)
// ─────────────────────────────────────────────────────────────
// WHY: We use EJS (Embedded JavaScript) templates instead of static HTML.
// EJS lets us inject dynamic data into pages: blog titles, user names,
// loop through arrays of posts, show/hide elements conditionally, etc.
//
// EXAMPLE: <h1><%= blog.title %></h1> → <h1>My First Post</h1>

app.set('view engine', 'ejs');
// → "Use EJS to render .ejs template files"

app.set('views', path.join(__dirname, 'views'));
// → "Look for .ejs files inside the 'views' folder"
// → path.join safely combines: /home/user/blog-app + views


// ─────────────────────────────────────────────────────────────
// Step 9: Configure body parsers (decode incoming data)
// ─────────────────────────────────────────────────────────────
// WHY: When a user submits a form (login, create blog), the browser
// sends the data in the HTTP request body. It arrives as raw bytes.
// These parsers decode it into JavaScript objects we can use.

app.use(express.urlencoded({ extended: true }));
// → Decodes form submissions (Content-Type: application/x-www-form-urlencoded)
// → Makes form data available as req.body.fieldName
// → extended: true allows nested objects in form data

app.use(express.json());
// → Decodes JSON payloads (Content-Type: application/json)
// → Useful if frontend sends data via fetch() or AJAX


// ─────────────────────────────────────────────────────────────
// Step 10: Serve static files (CSS, JS, images, uploads)
// ─────────────────────────────────────────────────────────────
// WHY: Express doesn't serve static files (CSS, images) by default.
// We tell it which folder contains our public assets.
//
// HOW: When the browser requests /css/client.css,
//      Express looks for public/css/client.css and sends it.
//      When it requests /uploads/blog-123.jpg,
//      Express looks for public/uploads/blog-123.jpg.

app.use(express.static(path.join(__dirname, 'public')));


// ─────────────────────────────────────────────────────────────
// Step 11: Configure Sessions
// ─────────────────────────────────────────────────────────────
// WHY: HTTP is "stateless" — the server forgets who sent each request.
// Sessions create persistent memory for each visitor.
//
// FLOW:
//   1. User visits → server creates session → sends cookie with session ID
//   2. User clicks another page → browser sends cookie → server finds session
//   3. Server recognizes the user (and knows if they're logged in)
//
// IMPORTANT ORDER: Sessions MUST be set up BEFORE Passport and Flash,
// because both depend on sessions to store data.

app.use(session({
    secret: process.env.SESSION_SECRET,
    // → Secret key used to sign (encrypt) the session cookie.
    //   Prevents attackers from forging session data.

    resave: false,
    // → Don't re-save the session if nothing changed.
    //   Improves performance by reducing unnecessary writes.

    saveUninitialized: false,
    // → Don't create empty sessions for visitors who aren't logged in.
    //   Saves memory and avoids creating sessions for bots/crawlers.

    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        // → Cookie expires after 24 hours (in milliseconds):
        //   1000ms × 60sec × 60min × 24hr = 86,400,000ms
        //   After expiry, user must log in again.

        httpOnly: true,
        // → Cookie is accessible ONLY by the server, not by client-side JS.
        //   Prevents XSS (Cross-Site Scripting) attacks from stealing sessions.

        secure: false
        // → Set to true in production with HTTPS.
        //   When true, cookie is only sent over encrypted connections.
    }
}));


// ─────────────────────────────────────────────────────────────
// Step 12: Initialize Passport & connect to sessions
// ─────────────────────────────────────────────────────────────
// WHY: Passport needs to be initialized and linked to Express sessions
// so it can persist login state across page navigations.
//
// CRITICAL ORDER: session() → passport.initialize() → passport.session()
// If this order is wrong, authentication will silently fail!

app.use(passport.initialize());
// → Boots up Passport. It's now ready to process authentication requests.

app.use(passport.session());
// → Tells Passport to use sessions for login persistence.
// → After login: Passport stores user ID in session (serializeUser).
// → On each request: Passport reads ID from session and loads user (deserializeUser).
// → The loaded user object is attached to req.user.


// ─────────────────────────────────────────────────────────────
// Step 13: Initialize Flash Messages
// ─────────────────────────────────────────────────────────────
// WHY: Flash messages are one-time notifications:
//   "Blog created successfully!" → appears once → gone on refresh
//
// HOW IT WORKS:
//   1. Controller sets message: req.flash('success_msg', 'Blog created!')
//   2. User is redirected to another page
//   3. The middleware in Step 14 reads the flash and passes it to the view
//   4. View displays the message
//   5. Message is automatically deleted from the session
//
// REQUIRES: Sessions (flash stores messages IN the session temporarily)

app.use(flash());


// ─────────────────────────────────────────────────────────────
// Step 14: Set global template variables (runs on EVERY request)
// ─────────────────────────────────────────────────────────────
// WHY: Some data must be available in EVERY EJS template:
//   - Flash messages (success, error)
//   - Currently logged-in user (name, role, avatar)
//
// res.locals is a special Express object — anything you put in it
// becomes automatically available in ALL views for that request.
// No need to manually pass these in every res.render() call.

app.use(setFlashMessages);


// ─────────────────────────────────────────────────────────────
// Step 15: Mount route handlers
// ─────────────────────────────────────────────────────────────
// WHY: Routes map URLs to controller functions.
// We have two route groups:

app.use('/', clientRoutes);
// → Handles public routes: /, /blog, /login, /about, etc.
// → No prefix — routes are mounted at the root.

app.use('/admin', adminRoutes);
// → Handles admin routes: /admin, /admin/posts, etc.
// → '/admin' prefix is prepended to every route in adminRoutes.js.
//   Example: router.get('/posts') → full URL becomes /admin/posts
// → ALL admin routes are protected by isAdmin middleware.


// ─────────────────────────────────────────────────────────────
// Step 16: 404 Error Handler (Page Not Found)
// ─────────────────────────────────────────────────────────────
// WHY: If someone visits a URL that doesn't match ANY route above,
// this middleware catches it and shows a friendly 404 page.
// It MUST come 