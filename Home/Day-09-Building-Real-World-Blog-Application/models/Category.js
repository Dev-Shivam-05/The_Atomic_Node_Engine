// ═══════════════════════════════════════════════════════════════════════
// models/Category.js — CATEGORY DATABASE MODEL
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Defines the structure for blog categories (Technology, Lifestyle, etc.)
// Categories organize blog posts into browsable groups.
//
// HOW IT CONNECTS:
//   controllers/admin/categoryController.js → CRUD categories
//   controllers/client/blogController.js → filter posts by category
//   routes/clientRoutes.js → loads categories for navbar dropdown
//   views → navbar, sidebar, filter bars, category pages
//
// ═══════════════════════════════════════════════════════════════════════


import mongoose from 'mongoose';
import slugify from 'slugify';


// ─────────────────────────────────────────────────────────────
// Step 1: Define the Category Schema
// ─────────────────────────────────────────────────────────────

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true
            // → "Health & Wellness" → "health-wellness"
            // → Used in URLs: /category/health-wellness
        },

        description: {
            type: String,
            default: ''
        },

        icon: {
            type: String,
            default: '📁'
            // → Emoji icon displayed alongside the category name
        }
    },
    {
        timestamps: true
    }
);


// ─────────────────────────────────────────────────────────────
// Step 2: Pre-save Hook — Generate slug from name
// ─────────────────────────────────────────────────────────────

categorySchema.pre('save', function (next) {
    // Generate slug whenever name is created or modified
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});


// ─────────────────────────────────────────────────────────────
// Step 3: Create and export the Model
// ─────────────────────────────────────────────────────────────

const Category = mongoose.model('Category', categorySchema);
// → Creates 'categories' collection in MongoDB

export default Category;