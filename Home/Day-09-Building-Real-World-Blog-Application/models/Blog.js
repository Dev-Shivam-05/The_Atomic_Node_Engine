// ═══════════════════════════════════════════════════════════════════════
// models/Blog.js — BLOG POST DATABASE MODEL
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Defines the structure for blog post documents in MongoDB.
// Every blog post — whether draft or published — follows this schema.
//
// SPECIAL FEATURES:
//   - Automatic slug generation (SEO-friendly URLs):
//     "My First Blog Post!" → "my-first-blog-post-1710234567890"
//   - Author reference (links to the User model via ObjectId)
//   - Status management (draft vs published)
//   - View counter (tracks how many times a post was read)
//   - Featured flag (highlighted posts on the home page)
//
// HOW IT CONNECTS:
//   controllers/admin/postController.js → CRUD operations
//   controllers/client/blogController.js → public display
//   controllers/client/homeController.js → featured/latest posts
//   models/Comment.js → comments reference this model
//
// ═══════════════════════════════════════════════════════════════════════


import mongoose from 'mongoose';
import slugify from 'slugify';
// → slugify converts human-readable text to URL-safe strings:
//   "Hello World! 🌍" → "hello-world"


// ─────────────────────────────────────────────────────────────
// Step 1: Define the Blog Schema
// ─────────────────────────────────────────────────────────────

const blogSchema = new mongoose.Schema(
    {
        blogTitle: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },

        slug: {
            type: String,
            unique: true
            // → URL-friendly identifier for the post
            // → Used in URLs: /blog/my-first-blog-post-1710234567890
            // → Better for SEO than /blog/65f1a2b3c4d5e6f7
            // → Auto-generated in the pre-save hook (Step 2)
        },

        blogImage: {
            type: String,
            default: 'default-blog.png'
            // → Stores the filename/path: "uploads/blog-123456.jpg"
            // → In views: <img src="/<%= blog.blogImage %>">
            // → The leading / makes it an absolute path from the public root
        },

        blogCategory: {
            type: String,
            required: [true, 'Category is required']
            // → Category name like "Technology", "Lifestyle"
        },

        blogTags: {
            type: String,
            default: ''
            // → Comma-separated tags: "AI, Web Dev, JavaScript"
            // → Stored as a string for simplicity
            // → Split into array when needed: blog.blogTags.split(',')
        },

        blogExcerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            maxlength: [500, 'Excerpt cannot exceed 500 characters']
            // → Short summary displayed in blog cards/listings
            // → Helps readers decide if they want to read the full post
        },

        blogContent: {
            type: String,
            required: [true, 'Content is required']
            // → The full blog post body (can be very long)
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            // → REFERENCE to the User model (a "relationship")
            // → Stores the author's MongoDB _id, not the full user object
            // → Use .populate('author') in queries to load the full user:
            //   Blog.findById(id).populate('author')
            //   → blog.author = { name: 'Admin', email: '...', ... }
        },

        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published'
            // → 'draft'     = saved but not visible to public
            // → 'published' = visible on the blog for everyone
        },

        views: {
            type: Number,
            default: 0
            // → Incremented each time someone views the post
            // → Used for "Popular Posts" sidebar and analytics
        },

        featured: {
            type: Boolean,
            default: false
            // → Featured posts get prominent placement on the home page
        }
    },
    {
        timestamps: true
        // → Adds createdAt and updatedAt automatically
    }
);


// ─────────────────────────────────────────────────────────────
// Step 2: Pre-save Hook — Auto-generate slug from title
// ─────────────────────────────────────────────────────────────
// WHEN: Before saving a NEW blog post.
// WHAT: Converts the title to a URL-safe slug.
// WHY:  Clean URLs are better for SEO and user experience:
//       /blog/my-first-post-1710234567 vs /blog/65f1a2b3c4d5e6
//
// NOTE: We only generate slug for NEW posts (this.isNew).
// When editing, slug stays the same so existing links don't break.
// This is called "URL stability" — a key SEO best practice.

blogSchema.pre('save', function (next) {
    if (this.isNew) {
        this.slug = slugify(this.blogTitle, {
            lower: true,     // → Convert to lowercase
            strict: true     // → Remove special characters (!@#$%^&*)
        }) + '-' + Date.now();
        // → Append timestamp for uniqueness
        // → "My First Post!" → "my-first-post-1710234567890"
        // → Without timestamp, two posts with the same title would collide
    }
    next();
});


// ─────────────────────────────────────────────────────────────
// Step 3: Index for performance
// ─────────────────────────────────────────────────────────────
// WHY: Indexes speed up database queries significantly.
// Without indexes, MongoDB scans every document (slow for large DBs).

blogSchema.index({ status: 1, createdAt: -1 });
// → Compound index on status + createdAt (descending)
// → Optimizes the most common query: "get published posts, newest first"

blogSchema.index({ blogCategory: 1 });
// → Index on category for fast category filtering


// ─────────────────────────────────────────────────────────────
// Step 4: Create and export the Model
// ─────────────────────────────────────────────────────────────

const Blog = mongoose.model('Blog', blogSchema);
// → Creates 'blogs' collection in MongoDB

export default Blog;