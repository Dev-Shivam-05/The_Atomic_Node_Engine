// ═══════════════════════════════════════════════════════════════════════
// models/Comment.js — COMMENT DATABASE MODEL
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Defines the structure for comments on blog posts.
// Visitors can leave comments; admins can approve, reject, or delete them.
//
// COMMENT LIFECYCLE:
// ┌─────────────────────────────────────────────────────────┐
// │ User writes comment → status: 'pending'                │
// │   ↓                                                     │
// │ Admin reviews in dashboard                              │
// │   ├─ Approve → status: 'approved' → visible on blog    │
// │   ├─ Reject  → status: 'rejected' → hidden from blog   │
// │   └─ Delete  → permanently removed from database        │
// └─────────────────────────────────────────────────────────┘
//
// HOW IT CONNECTS:
//   controllers/client/blogController.js → creates comments (addComment)
//   controllers/admin/commentController.js → approve/reject/delete
//   views/client/pages/single-blog.ejs → displays approved comments
//   views/admin/pages/comments.ejs → admin comment management table
//
// ═══════════════════════════════════════════════════════════════════════


import mongoose from 'mongoose';


// ─────────────────────────────────────────────────────────────
// Step 1: Define the Comment Schema
// ─────────────────────────────────────────────────────────────

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Comment content is required'],
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        },

        authorName: {
            type: String,
            required: [true, 'Your name is required'],
            trim: true
            // → Name shown publicly alongside the comment
        },

        authorEmail: {
            type: String,
            required: [true, 'Your email is required'],
            trim: true,
            lowercase: true
            // → Not displayed publicly, but stored for admin reference
            // → Could be used for notifications or gravatar
        },

        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: true
            // → Links this comment to a specific blog post
            // → Allows queries like: Comment.find({ blog: blogId })
            // → Can be populated: Comment.find().populate('blog')
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
            // → 'pending'  = awaiting admin review
            // → 'approved' = visible on the blog post
            // → 'rejected' = hidden but not deleted (admin decided to reject)
        }
    },
    {
        timestamps: true
        // → createdAt = when the comment was submitted
    }
);


// ─────────────────────────────────────────────────────────────
// Step 2: Index for performance
// ─────────────────────────────────────────────────────────────

commentSchema.index({ blog: 1, status: 1 });
// → Speeds up: "Get all approved comments for blog post X"
// → This is the most common comment query


// ─────────────────────────────────────────────────────────────
// Step 3: Create and export the Model
// ─────────────────────────────────────────────────────────────

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;