// ═══════════════════════════════════════════════════════════════════════
// controllers/admin/commentController.js — COMMENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Admin interface for managing blog comments:
//   - View all comments (pending, approved, rejected)
//   - Approve pending comments
//   - Delete comments permanently
//
// HOW IT CONNECTS:
// routes/adminRoutes.js:
//   GET /admin/comments              → all
//   GET /admin/comments/approve/:id  → approve
//   GET /admin/comments/delete/:id   → delete
//
// ═══════════════════════════════════════════════════════════════════════


import Comment from '../../models/Comment.js';


const commentController = {

    // ─────────────────────────────────────────────────────────
    // all — Show all comments with status filtering
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/comments
    // ROUTE: GET /admin/comments?status=pending

    all: async (req, res) => {
        try {
            // Step 1: Build filter from query string
            const statusFilter = req.query.status || null;
            const filter = {};

            if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
                filter.status = statusFilter;
            }

            // Step 2: Fetch comments with blog post reference
            const comments = await Comment.find(filter)
                .sort({ createdAt: -1 })
                .populate('blog', 'blogTitle slug')
                // → Loads the associated blog post's title and slug
                // → So we can show "Comment on: [Blog Title]" in the admin table
                .lean();

            // Step 3: Get counts for filter tabs
            const counts = {
                all: await Comment.countDocuments(),
                pending: await Comment.countDocuments({ status: 'pending' }),
                approved: await Comment.countDocuments({ status: 'approved' }),
                rejected: await Comment.countDocuments({ status: 'rejected' })
            };

            // Step 4: Render the comments management page
            res.render('admin/pages/comments', {
                title: 'Manage Comments',
                comments,
                counts,
                statusFilter
            });

        } catch (error) {
            console.error('Comments Error:', error.message);
            req.flash('error_msg', 'Failed to load comments.');
            res.redirect('/admin');
        }
    },


    // ─────────────────────────────────────────────────────────
    // approve — Change comment status to 'approved'
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/comments/approve/:id

    approve: async (req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);

            if (!comment) {
                req.flash('error_msg', 'Comment not found.');
                return res.redirect('/admin/comments');
            }

            // Step 1: Update the status
            comment.status = 'approved';
            await comment.save();

            req.flash('success_msg', 'Comment approved and is now visible on the blog.');
            res.redirect('/admin/comments');

        } catch (error) {
            console.error('Approve Comment Error:', error.message);
            req.flash('error_msg', 'Failed to approve comment.');
            res.redirect('/admin/comments');
        }
    },


    // ─────────────────────────────────────────────────────────
    // delete — Permanently delete a comment
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/comments/delete/:id

    delete: async (req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);

            if (!comment) {
                req.flash('error_msg', 'Comment not found.');
                return res.redirect('/admin/comments');
            }

            await Comment.findByIdAndDelete(req.params.id);

            req.flash('success_msg', 'Comment deleted permanently.');
            res.redirect('/admin/comments');

        } catch (error) {
            console.error('Delete Comment Error:', error.message);
            req.flash('error_msg', 'Failed to delete comment.');
            res.redirect('/admin/comments');
        }
    }
};


export default commentController;