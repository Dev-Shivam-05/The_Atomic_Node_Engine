// ═══════════════════════════════════════════════════════════════════════
// routes/adminRoutes.js — ADMIN DASHBOARD ROUTES (PROTECTED)
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Defines ALL routes for the admin dashboard. Every route here is
// protected by the isAdmin middleware — only logged-in admin users
// can access any of these endpoints.
//
// IMPORTANT: server.js mounts this with '/admin' prefix:
//   app.use('/admin', adminRoutes);
//   So router.get('/posts') → actual URL is /admin/posts
//
// ROUTE TABLE:
// ┌──────────────────────────────┬────────┬─────────────────────────┐
// │ Full URL                     │ Method │ Handler                 │
// ├──────────────────────────────┼────────┼─────────────────────────┤
// │ /admin                       │ GET    │ dashboard.index         │
// │ /admin/posts                 │ GET    │ post.all                │
// │ /admin/posts/create          │ GET    │ post.createPage         │
// │ /admin/posts/create          │ POST   │ post.create             │
// │ /admin/posts/edit/:id        │ GET    │ post.editPage           │
// │ /admin/posts/edit/:id        │ POST   │ post.update             │
// │ /admin/posts/delete/:id     │ GET    │ post.delete             │
// │ /admin/categories            │ GET    │ category.all            │
// │ /admin/categories            │ POST   │ category.create         │
// │ /admin/categories/edit/:id   │ POST   │ category.update         │
// │ /admin/categories/delete/:id │ GET    │ category.delete         │
// │ /admin/comments              │ GET    │ comment.all             │
// │ /admin/comments/approve/:id  │ GET    │ comment.approve         │
// │ /admin/comments/delete/:id   │ GET    │ comment.delete          │
// │ /admin/settings              │ GET    │ settings.index          │
// │ /admin/settings              │ POST   │ settings.update         │
// └──────────────────────────────┴────────┴─────────────────────────┘
//
// ═══════════════════════════════════════════════════════════════════════


import { Router } from 'express';

const router = Router();


// ─────────────────────────────────────────────────────────────
// Step 1: Import Controllers
// ─────────────────────────────────────────────────────────────

import dashboardController from '../controllers/admin/dashboardController.js';
import postController from '../controllers/admin/postController.js';
import categoryController from '../controllers/admin/categoryController.js';
import commentController from '../controllers/admin/commentController.js';
import settingsController from '../controllers/admin/settingsController.js';


// ─────────────────────────────────────────────────────────────
// Step 2: Import Middleware
// ─────────────────────────────────────────────────────────────

import { isAdmin } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';


// ─────────────────────────────────────────────────────────────
// Step 3: Import Models for sidebar data
// ─────────────────────────────────────────────────────────────

import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';


// ─────────────────────────────────────────────────────────────
// Step 4: PROTECT ALL ADMIN ROUTES
// ─────────────────────────────────────────────────────────────
// router.use(isAdmin) applies the isAdmin guard to EVERY route
// defined below. This means:
//   - Non-logged-in users → redirected to /login
//   - Logged-in regular users → redirected to /login
//   - Logged-in admin users → allowed through

router.use(isAdmin);


// ─────────────────────────────────────────────────────────────
// Step 5: Load sidebar data for ALL admin pages
// ─────────────────────────────────────────────────────────────
// The admin sidebar shows badge counts (total posts, pending comments).
// We query these ONCE here instead of in every controller.

router.use(async (req, res, next) => {
    try {
        // Step 5a: Count total blog posts (for sidebar badge)
        res.locals.sidebarTotalPosts = await Blog.countDocuments();

        // Step 5b: Count pending comments (for notification badge)
        res.locals.sidebarPendingComments = await Comment.countDocuments({
            status: 'pending'
        });

    } catch (error) {
        res.locals.sidebarTotalPosts = 0;
        res.locals.sidebarPendingComments = 0;
    }

    // Step 5c: Determine which page is active for sidebar highlighting
    // WHY: The sidebar link for the current page should be visually
    // highlighted (different color/background) so admin knows where they are.
    const urlPath = req.path;

    if (urlPath === '/' || urlPath === '') {
        res.locals.currentPage = 'dashboard';
    } else if (urlPath.startsWith('/posts')) {
        res.locals.currentPage = 'posts';
    } else if (urlPath.startsWith('/categories')) {
        res.locals.currentPage = 'categories';
    } else if (urlPath.startsWith('/comments')) {
        res.locals.currentPage = 'comments';
    } else if (urlPath.startsWith('/settings')) {
        res.locals.currentPage = 'settings';
    } else {
        res.locals.currentPage = '';
    }

    next();
});


// ─────────────────────────────────────────────────────────────
// Step 6: Define Routes
// ─────────────────────────────────────────────────────────────
// Remember: '/admin' prefix is added by server.js
// So router.get('/') → /admin/
//    router.get('/posts') → /admin/posts


// ═══ DASHBOARD ═══
router.get('/', dashboardController.index);


// ═══ BLOG POST MANAGEMENT ═══

router.get('/posts', postController.all);
// → List all posts in a table

router.get('/posts/create', postController.createPage);
// → Show the "create new post" form

router.post('/posts/create', upload.single('blogImage'), postController.create);
// → Process form + image upload → save post to DB
// → upload.single('blogImage'): Multer handles the file upload
//   - 'blogImage' = the name attribute of the <input type="file"> in the form
//   - After processing, req.file contains the uploaded file info
//   - req.file.filename = the generated filename (e.g., "blog-1234567.jpg")

router.get('/posts/edit/:id', postController.editPage);
// → Show edit form pre-filled with existing post data

router.post('/posts/edit/:id', upload.single('blogImage'), postController.update);
// → Process edit form → update post in DB
// → If new image uploaded: req.file exists → use new image
// → If no new image: req.file is undefined → keep existing image

router.get('/posts/delete/:id', postController.delete);
// → Delete a blog post permanently


// ═══ CATEGORY MANAGEMENT ═══

router.get('/categories', categoryController.all);
// → Show all categories + create form

router.post('/categories', categoryController.create);
// → Create a new category

router.post('/categories/edit/:id', categoryController.update);
// → Update a category's name/icon/description

router.get('/categories/delete/:id', categoryController.delete);
// → Delete a category


// ═══ COMMENT MANAGEMENT ═══

router.get('/comments', commentController.all);
// → Show all comments with status indicators

router.get('/comments/approve/:id', commentController.approve);
// → Change comment status to 'approved'

router.get('/comments/delete/:id', commentController.delete);
// → Permanently delete a comment


// ═══ SETTINGS ═══

router.get('/settings', settingsController.index);
router.post('/settings', settingsController.update);


// ─────────────────────────────────────────────────────────────
// Step 7: Export the router
// ─────────────────────────────────────────────────────────────

export default router;