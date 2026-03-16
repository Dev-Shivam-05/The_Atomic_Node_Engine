// ═══════════════════════════════════════════════════════════════════════
// routes/clientRoutes.js — PUBLIC WEBSITE ROUTES
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Maps every public-facing URL to a specific controller function.
// When someone visits a URL in their browser, Express checks this file
// to determine which function should handle the request.
//
// ROUTE TABLE:
// ┌────────────────────┬────────┬──────────────────────────────────┐
// │ URL                │ Method │ Handler                          │
// ├────────────────────┼────────┼──────────────────────────────────┤
// │ /                  │ GET    │ homeController.index             │
// │ /blog              │ GET    │ blogController.listing           │
// │ /blog/:slug        │ GET    │ blogController.single            │
// │ /category/:slug    │ GET    │ blogController.byCategory        │
// │ /search            │ GET    │ blogController.search            │
// │ /about             │ GET    │ pageController.about             │
// │ /contact           │ GET    │ pageController.contact           │
// │ /contact           │ POST   │ pageController.submitContact     │
// │ /login             │ GET    │ authController.loginPage         │
// │ /login             │ POST   │ authController.login             │
// │ /register          │ GET    │ authController.registerPage      │
// │ /register          │ POST   │ authController.register          │
// │ /logout            │ GET    │ authController.logout            │
// │ /blog/:id/comment  │ POST   │ blogController.addComment        │
// └────────────────────┴────────┴──────────────────────────────────┘
//
// HOW IT CONNECTS:
// server.js mounts these: app.use('/', clientRoutes);
// Routes start from root — /blog, /about, /login, etc.
//
// ═══════════════════════════════════════════════════════════════════════


import { Router } from 'express';
// → Import only the Router class (more precise than importing all of express)

const router = Router();


// ─────────────────────────────────────────────────────────────
// Step 1: Import Controllers
// ─────────────────────────────────────────────────────────────

import homeController from '../controllers/client/homeController.js';
import blogController from '../controllers/client/blogController.js';
import pageController from '../controllers/client/pageController.js';
import authController from '../controllers/client/authController.js';


// ─────────────────────────────────────────────────────────────
// Step 2: Import Middleware Guards
// ─────────────────────────────────────────────────────────────

import { isAuthenticated, isGuest } from '../middlewares/authMiddleware.js';


// ─────────────────────────────────────────────────────────────
// Step 3: Import Category model for navbar data
// ─────────────────────────────────────────────────────────────

import Category from '../models/Category.js';


// ─────────────────────────────────────────────────────────────
// Step 4: Global middleware — Load categories for ALL client pages
// ─────────────────────────────────────────────────────────────
// WHY: The navbar on every page has a "Categories" dropdown menu.
// Instead of loading categories in every controller function,
// we load them ONCE here and put them in res.locals.
// This runs BEFORE every route handler in this router.

router.use(async (req, res, next) => {
    try {
        res.locals.navCategories = await Category.find().sort({ name: 1 }).lean();
        // → .find()         = get all categories
        // → .sort({name:1}) = sort A→Z alphabetically
        // → .lean()         = return plain JS objects (faster, less memory)
        //   Without .lean(), Mongoose returns full documents with methods
        //   and change tracking. We only need the data for display.
    } catch (error) {
        res.locals.navCategories = [];
        // → If query fails, use empty array so templates don't crash
    }
    next();
});


// ─────────────────────────────────────────────────────────────
// Step 5: Define Routes
// ─────────────────────────────────────────────────────────────
// FORMAT: router.method(path, [middleware], handler)
// - method: get, post, put, delete
// - path: URL pattern (can include :params)
// - middleware: optional guard (isAuthenticated, isGuest)
// - handler: controller function that processes the request


// ═══ HOME ═══
router.get('/', homeController.index);


// ═══ BLOG ═══
router.get('/blog', blogController.listing);
// → Shows paginated list of all published blog posts

router.get('/blog/:slug', blogController.single);
// → Shows a single blog post by its slug
// → :slug is a URL parameter → req.params.slug
// → Example: /blog/my-first-post-1710234567


// ═══ CATEGORY ═══
router.get('/category/:slug', blogController.byCategory);
// → Shows posts filtered by category
// → Example: /category/technology


// ═══ SEARCH ═══
router.get('/search', blogController.search);
// → Shows search results
// → Query string: /search?q=javascript → req.query.q = "javascript"


// ═══ STATIC PAGES ═══
router.get('/about', pageController.about);
router.get('/contact', pageController.contact);
router.post('/contact', pageController.submitContact);


// ═══ AUTHENTICATION ═══
router.get('/login', isGuest, authController.loginPage);
// → isGuest: if already logged in, redirect away

router.post('/login', authController.login);
// → Passport.authenticate('local') handles verification

router.get('/register', isGuest, authController.registerPage);
router.post('/register', authController.register);

router.get('/logout', authController.logout);
// → Destroys session and redirects to home


// ═══ COMMENTS ═══
router.post('/blog/:id/comment', isAuthenticated, blogController.addComment);
// → isAuthenticated: must be logged in to comment
// → :id is the blog post's MongoDB _id


// ─────────────────────────────────────────────────────────────
// Step 6: Export the router
// ─────────────────────────────────────────────────────────────

export default router;