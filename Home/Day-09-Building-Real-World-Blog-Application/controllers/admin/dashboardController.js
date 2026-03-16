// ═══════════════════════════════════════════════════════════════════════
// controllers/admin/dashboardController.js — ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Renders the admin dashboard overview page with:
//   - Statistics cards (total posts, categories, comments, views)
//   - Recent blog posts
//   - Recent comments
//   - Quick action buttons
//
// HOW IT CONNECTS:
// routes/adminRoutes.js → router.get('/', dashboardController.index)
// → This renders views/admin/pages/dashboard.ejs
//
// ═══════════════════════════════════════════════════════════════════════


import Blog from '../../models/Blog.js';
import Category from '../../models/Category.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';


const dashboardController = {

    // ─────────────────────────────────────────────────────────
    // index — Show the admin dashboard
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin

    index: async (req, res) => {
        try {
            // Step 1: Fetch statistics for the stats cards
            const totalPosts = await Blog.countDocuments();
            const publishedPosts = await Blog.countDocuments({ status: 'published' });
            const draftPosts = await Blog.countDocuments({ status: 'draft' });
            const totalCategories = await Category.countDocuments();
            const totalComments = await Comment.countDocuments();
            const pendingComments = await Comment.countDocuments({ status: 'pending' });
            const totalUsers = await User.countDocuments();

            // Step 2: Calculate total views across all posts
            const viewsResult = await Blog.aggregate([
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: '$views' }
                    }
                }
            ]);
            // → .aggregate() runs a MongoDB aggregation pipeline
            // → $group groups all documents together (_id: null = all in one group)
            // → $sum: '$views' adds up all the 'views' fields
            // → Result: [{ _id: null, totalViews: 1234 }] or [] if no posts
            const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

            // Step 3: Fetch recent posts for the "Recent Posts" widget
            const recentPosts = await Blog.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('author', 'name')
                .lean();

            // Step 4: Fetch recent comments for the "Recent Comments" widget
            const recentComments = await Comment.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('blog', 'blogTitle slug')
                // → Populates the 'blog' reference with only title and slug
                .lean();

            // Step 5: Render the dashboard view
            res.render('admin/pages/dashboard', {
                title: 'Dashboard',
                stats: {
                    totalPosts,
                    publishedPosts,
                    draftPosts,
                    totalCategories,
                    totalComments,
                    pendingComments,
                    totalUsers,
                    totalViews
                },
                recentPosts,
                recentComments
            });

        } catch (error) {
            console.error('Dashboard Error:', error.message);
            req.flash('error_msg', 'Failed to load dashboard data.');
            res.render('admin/pages/dashboard', {
                title: 'Dashboard',
                stats: {
                    totalPosts: 0, publishedPosts: 0, draftPosts: 0,
                    totalCategories: 0, totalComments: 0, pendingComments: 0,
                    totalUsers: 0, totalViews: 0
                },
                recentPosts: [],
                recentComments: []
            });
        }
    }
};


export default dashboardController;