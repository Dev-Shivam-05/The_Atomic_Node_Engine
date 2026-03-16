// ═══════════════════════════════════════════════════════════════════════
// controllers/admin/postController.js — BLOG POST CRUD CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles ALL blog post management operations:
//   - List all posts (with filters)
//   - Show create form
//   - Create new post (with image upload)
//   - Show edit form (pre-filled)
//   - Update existing post
//   - Delete a post
//
// HOW IT CONNECTS:
// routes/adminRoutes.js maps these:
//   GET  /admin/posts              → all
//   GET  /admin/posts/create       → createPage
//   POST /admin/posts/create       → create (+ multer upload)
//   GET  /admin/posts/edit/:id     → editPage
//   POST /admin/posts/edit/:id     → update (+ multer upload)
//   GET  /admin/posts/delete/:id   → delete
//
// ═══════════════════════════════════════════════════════════════════════


import Blog from '../../models/Blog.js';
import Category from '../../models/Category.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Reconstruct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const postController = {

    // ─────────────────────────────────────────────────────────
    // all — List all blog posts (admin table view)
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/posts
    // ROUTE: GET /admin/posts?status=draft&page=2

    all: async (req, res) => {
        try {
            // Step 1: Read filter and pagination from query string
            const statusFilter = req.query.status || null;
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            // Step 2: Build the query filter
            const filter = {};
            if (statusFilter && ['published', 'draft'].includes(statusFilter)) {
                filter.status = statusFilter;
            }

            // Step 3: Count posts for pagination and status badges
            const totalPosts = await Blog.countDocuments(filter);
            const totalPages = Math.ceil(totalPosts / limit);

            // Counts for the filter buttons ("All (28)", "Published (20)", "Drafts (8)")
            const counts = {
                all: await Blog.countDocuments(),
                published: await Blog.countDocuments({ status: 'published' }),
                drafts: await Blog.countDocuments({ status: 'draft' })
            };

            // Step 4: Fetch the posts
            const blogs = await Blog.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'name')
                .lean();

            // Step 5: Render the admin posts table
            res.render('admin/pages/all-posts', {
                title: 'All Posts',
                blogs,
                counts,
                statusFilter,
                totalPosts,
                pagination: {
                    page,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.error('Admin All Posts Error:', error.message);
            req.flash('error_msg', 'Failed to load posts.');
            res.redirect('/admin');
        }
    },


    // ─────────────────────────────────────────────────────────
    // createPage — Show the "create new post" form
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/posts/create

    createPage: async (req, res) => {
        try {
            // Step 1: Fetch categories for the category dropdown
            const categories = await Category.find().sort({ name: 1 }).lean();

            res.render('admin/pages/create-post', {
                title: 'Create New Post',
                categories
            });

        } catch (error) {
            console.error('Create Page Error:', error.message);
            req.flash('error_msg', 'Failed to load the create form.');
            res.redirect('/admin/posts');
        }
    },


    // ─────────────────────────────────────────────────────────
    // create — Process the form and create a new blog post
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /admin/posts/create
    // MIDDLEWARE: upload.single('blogImage') handles the file

    create: async (req, res) => {
        try {
            // Step 1: Extract form data from req.body
            const { blogTitle, blogCategory, blogTags, blogExcerpt, blogContent, status } = req.body;

            // Step 2: Validate required fields
            if (!blogTitle || !blogCategory || !blogExcerpt || !blogContent) {
                req.flash('error_msg', 'Please fill in all required fields.');
                return res.redirect('/admin/posts/create');
            }

            // Step 3: Determine the image path
            // If Multer processed an upload, req.file contains the file info.
            // req.file.filename = the generated filename (e.g., "blog-123.jpg")
            let blogImage = 'default-blog.png';
            if (req.file) {
                blogImage = `uploads/${req.file.filename}`;
                // → Stored as relative path from the public folder
                // → In views: <img src="/<%= blog.blogImage %>">
                // → Which becomes: <img src="/uploads/blog-123.jpg">
            }

            // Step 4: Create the blog post in the database
            await Blog.create({
                blogTitle: blogTitle.trim(),
                blogImage,
                blogCategory,
                blogTags: blogTags || '',
                blogExcerpt: blogExcerpt.trim(),
                blogContent: blogContent.trim(),
                author: req.user._id,
                // → req.user is set by Passport (the logged-in admin)
                status: status || 'published'
            });
            // → The pre-save hook in Blog.js auto-generates the slug

            // Step 5: Success feedback
            req.flash('success_msg', 'Blog post created successfully!');
            res.redirect('/admin/posts');

        } catch (error) {
            console.error('Create Post Error:', error.message);
            req.flash('error_msg', 'Failed to create the blog post. Please try again.');
            res.redirect('/admin/posts/create');
        }
    },


    // ─────────────────────────────────────────────────────────
    // editPage — Show the edit form pre-filled with post data
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/posts/edit/:id

    editPage: async (req, res) => {
        try {
            // Step 1: Find the blog post by its ID
            const blog = await Blog.findById(req.params.id).lean();

            if (!blog) {
                req.flash('error_msg', 'Blog post not found.');
                return res.redirect('/admin/posts');
            }

            // Step 2: Fetch categories for the dropdown
            const categories = await Category.find().sort({ name: 1 }).lean();

            // Step 3: Render the edit form with existing data
            res.render('admin/pages/edit-post', {
                title: 'Edit Post',
                blog,
                categories
            });

        } catch (error) {
            console.error('Edit Page Error:', error.message);
            req.flash('error_msg', 'Failed to load the edit form.');
            res.redirect('/admin/posts');
        }
    },


    // ─────────────────────────────────────────────────────────
    // update — Process the edit form and update the post
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /admin/posts/edit/:id
    // MIDDLEWARE: upload.single('blogImage')

    update: async (req, res) => {
        try {
            // Step 1: Find the existing blog post
            const blog = await Blog.findById(req.params.id);

            if (!blog) {
                req.flash('error_msg', 'Blog post not found.');
                return res.redirect('/admin/posts');
            }

            // Step 2: Extract updated data from the form
            const { blogTitle, blogCategory, blogTags, blogExcerpt, blogContent, status } = req.body;

            // Step 3: Build the update object
            const updateData = {
                blogTitle: blogTitle ? blogTitle.trim() : blog.blogTitle,
                blogCategory: blogCategory || blog.blogCategory,
                blogTags: blogTags !== undefined ? blogTags : blog.blogTags,
                blogExcerpt: blogExcerpt ? blogExcerpt.trim() : blog.blogExcerpt,
                blogContent: blogContent ? blogContent.trim() : blog.blogContent,
                status: status || blog.status
            };

            // Step 4: Handle image upload (if a new image was provided)
            if (req.file) {
                updateData.blogImage = `uploads/${req.file.filename}`;

                // Step 4b: Delete the old image file (cleanup)
                // Only delete if the old image isn't the default placeholder
                if (blog.blogImage && blog.blogImage !== 'default-blog.png') {
                    const oldImagePath = path.join(__dirname, '../../public', blog.blogImage);
                    // → Constructs full file path: /home/user/blog-app/public/uploads/old-image.jpg

                    // Check if file exists before trying to delete
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        // → fs.unlinkSync() deletes the file synchronously
                        // → This prevents orphaned files from piling up on disk
                    }
                }
            }
            // → If no new file uploaded (req.file is undefined),
            //   we keep the existing blogImage (it stays unchanged)

            // Step 5: Update the document in MongoDB
            await Blog.findByIdAndUpdate(req.params.id, updateData);
            // → findByIdAndUpdate() finds by _id and applies the update
            // → Note: pre-save hooks DON'T run on findByIdAndUpdate
            //   So the slug won't change (which is what we want)

            // Step 6: Success feedback
            req.flash('success_msg', 'Blog post updated successfully!');
            res.redirect('/admin/posts');

        } catch (error) {
            console.error('Update Post Error:', error.message);
            req.flash('error_msg', 'Failed to update the blog post.');
            res.redirect(`/admin/posts/edit/${req.params.id}`);
        }
    },


    // ─────────────────────────────────────────────────────────
    // delete — Delete a blog post permanently
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/posts/delete/:id

    delete: async (req, res) => {
        try {
            // Step 1: Find the blog post
            const blog = await Blog.findById(req.params.id);

            if (!blog) {
                req.flash('error_msg', 'Blog post not found.');
                return res.redirect('/admin/posts');
            }

            // Step 2: Delete the image file from disk
            if (blog.blogImage && blog.blogImage !== 'default-blog.png') {
                const imagePath = path.join(__dirname, '../../public', blog.blogImage);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Step 3: Delete all comments associated with this post
            await Comment.deleteMany({ blog: blog._id });
            // → Remove orphaned comments (no point keeping them if the post is gone)

            // Step 4: Delete the blog post document
            await Blog.findByIdAndDelete(req.params.id);

            // Step 5: Success feedback
            req.flash('success_msg', 'Blog post and its comments have been deleted.');
            res.redirect('/admin/posts');

        } catch (error) {
            console.error('Delete Post Error:', error.message);
            req.flash('error_msg', 'Failed to delete the blog post.');
            res.redirect('/admin/posts');
        }
    }
};


export default postController;