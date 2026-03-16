// ═══════════════════════════════════════════════════════════════════════
// controllers/admin/categoryController.js — CATEGORY CRUD CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Manages blog categories: create, view all, update, and delete.
// The admin can add new categories (like "Travel") and manage existing ones.
//
// HOW IT CONNECTS:
// routes/adminRoutes.js:
//   GET  /admin/categories              → all
//   POST /admin/categories              → create
//   POST /admin/categories/edit/:id     → update
//   GET  /admin/categories/delete/:id   → delete
//
// ═══════════════════════════════════════════════════════════════════════


import Category from '../../models/Category.js';
import Blog from '../../models/Blog.js';


const categoryController = {

    // ─────────────────────────────────────────────────────────
    // all — Show all categories + create form
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/categories

    all: async (req, res) => {
        try {
            // Step 1: Fetch all categories sorted alphabetically
            const categories = await Category.find().sort({ name: 1 }).lean();

            // Step 2: Count posts in each category
            const categoriesWithCount = await Promise.all(
                categories.map(async (cat) => {
                    const postCount = await Blog.countDocuments({
                        blogCategory: cat.name
                    });
                    return { ...cat, postCount };
                })
            );

            // Step 3: Render the categories management page
            res.render('admin/pages/categories', {
                title: 'Manage Categories',
                categories: categoriesWithCount
            });

        } catch (error) {
            console.error('Categories Error:', error.message);
            req.flash('error_msg', 'Failed to load categories.');
            res.redirect('/admin');
        }
    },


    // ─────────────────────────────────────────────────────────
    // create — Add a new category
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /admin/categories

    create: async (req, res) => {
        try {
            const { name, icon, description } = req.body;

            // Step 1: Validate
            if (!name || !name.trim()) {
                req.flash('error_msg', 'Category name is required.');
                return res.redirect('/admin/categories');
            }

            // Step 2: Check if category already exists
            const existing = await Category.findOne({
                name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
                // → Case-insensitive exact match
                // → Prevents creating "Technology" when "technology" exists
            });

            if (existing) {
                req.flash('error_msg', `Category "${name}" already exists.`);
                return res.redirect('/admin/categories');
            }

            // Step 3: Create the category
            await Category.create({
                name: name.trim(),
                icon: icon || '📁',
                description: description || ''
            });
            // → Pre-save hook auto-generates the slug

            req.flash('success_msg', `Category "${name}" created successfully!`);
            res.redirect('/admin/categories');

        } catch (error) {
            console.error('Create Category Error:', error.message);
            req.flash('error_msg', 'Failed to create category.');
            res.redirect('/admin/categories');
        }
    },


    // ─────────────────────────────────────────────────────────
    // update — Edit an existing category
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /admin/categories/edit/:id

    update: async (req, res) => {
        try {
            const { name, icon, description } = req.body;

            if (!name || !name.trim()) {
                req.flash('error_msg', 'Category name is required.');
                return res.redirect('/admin/categories');
            }

            // Step 1: Find and update the category
            const category = await Category.findById(req.params.id);

            if (!category) {
                req.flash('error_msg', 'Category not found.');
                return res.redirect('/admin/categories');
            }

            // Step 2: If name changed, update all blog posts with the old name
            const oldName = category.name;
            const newName = name.trim();

            if (oldName !== newName) {
                await Blog.updateMany(
                    { blogCategory: oldName },
                    { blogCategory: newName }
                );
                // → Updates all posts that had the old category name
                // → This maintains data consistency
            }

            // Step 3: Update the category document
            category.name = newName;
            category.icon = icon || category.icon;
            category.description = description !== undefined ? description : category.description;
            await category.save();
            // → .save() triggers the pre-save hook which regenerates the slug

            req.flash('success_msg', `Category updated to "${newName}" successfully!`);
            res.redirect('/admin/categories');

        } catch (error) {
            console.error('Update Category Error:', error.message);
            req.flash('error_msg', 'Failed to update category.');
            res.redirect('/admin/categories');
        }
    },


    // ─────────────────────────────────────────────────────────
    // delete — Remove a category
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/categories/delete/:id

    delete: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                req.flash('error_msg', 'Category not found.');
                return res.redirect('/admin/categories');
            }

            // Step 1: Check if any posts use this category
            const postCount = await Blog.countDocuments({ blogCategory: category.name });

            if (postCount > 0) {
                req.flash('error_msg', `Cannot delete "${category.name}" — it has ${postCount} post(s). Reassign them first.`);
                return res.redirect('/admin/categories');
            }

            // Step 2: Delete the category
            await Category.findByIdAndDelete(req.params.id);

            req.flash('success_msg', `Category "${category.name}" deleted successfully!`);
            res.redirect('/admin/categories');

        } catch (error) {
            console.error('Delete Category Error:', error.message);
            req.flash('error_msg', 'Failed to delete category.');
            res.redirect('/admin/categories');
        }
    }
};


export default categoryController;