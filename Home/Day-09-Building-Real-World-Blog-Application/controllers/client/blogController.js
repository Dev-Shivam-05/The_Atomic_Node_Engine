// ═══════════════════════════════════════════════════════════════════════
// controllers/client/blogController.js — BLOG DISPLAY CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles all public blog-related logic:
//   - Listing all published posts (with pagination)
//   - Showing a single blog post (with comments)
//   - Filtering posts by category
//   - Searching posts by keyword
//   - Adding comments to posts
//
// HOW IT CONNECTS:
// routes/clientRoutes.js maps URLs to these methods:
//   GET  /blog           → blogController.listing
//   GET  /blog/:slug     → blogController.single
//   GET  /category/:slug → blogController.byCategory
//   GET  /search         → blogController.search
//   POST /blog/:id/comment → blogController.addComment
//
// ═══════════════════════════════════════════════════════════════════════


import Blog from '../../models/Blog.js';
import Category from '../../models/Category.js';
import Comment from '../../models/Comment.js';


const blogController = {

    // ─────────────────────────────────────────────────────────
    // listing — Show all published posts with pagination
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /blog
    // ROUTE: GET /blog?page=2
    //
    // PAGINATION LOGIC:
    //   - Default: 6 posts per page
    //   - Page number comes from query string: /blog?page=2
    //   - skip = (page - 1) * limit → skip first N posts
    //   - totalPages = Math.ceil(totalPosts / limit)

    listing: async (req, res) => {
        try {
            // Step 1: Get the current page number from the URL query string
            const page = parseInt(req.query.page) || 1;
            // → /blog?page=3 → req.query.page = "3" → parseInt → 3
            // → If no page param or invalid: default to page 1

            const limit = 6;
            // → Show 6 posts per page

            const skip = (page - 1) * limit;
            // → Page 1: skip 0 posts (show posts 1-6)
            // → Page 2: skip 6 posts (show posts 7-12)
            // → Page 3: skip 12 posts (show posts 13-18)

            // Step 2: Count total published posts (for pagination math)
            const totalPosts = await Blog.countDocuments({ status: 'published' });
            const totalPages = Math.ceil(totalPosts / limit);
            // → 25 posts ÷ 6 per page = 4.16 → ceil → 5 pages

            // Step 3: Fetch the posts for the current page
            const blogs = await Blog.find({ status: 'published' })
                .sort({ createdAt: -1 })     // → Newest first
                .skip(skip)                   // → Skip posts from previous pages
                .limit(limit)                 // → Only get 6 posts
                .populate('author', 'name avatar')
                .lean();

            // Step 4: Fetch sidebar data
            const categories = await Category.find().lean();

            // Step 4b: Count posts per category for sidebar badges
            const categoriesWithCount = await Promise.all(
                categories.map(async (cat) => {
                    const postCount = await Blog.countDocuments({
                        blogCategory: cat.name,
                        status: 'published'
                    });
                    return { ...cat, postCount };
                })
            );

            // Step 4c: Get popular posts (most viewed) for sidebar
            const popularPosts = await Blog.find({ status: 'published' })
                .sort({ views: -1 })
                // → Sort by views descending = most viewed first
                .limit(5)
                .lean();

            // Step 4d: Collect all unique tags from all posts for sidebar tag cloud
            const allPosts = await Blog.find({ status: 'published' })
                .select('blogTags')
                // → .select('blogTags') fetches ONLY the blogTags field
                //   This is much more efficient than loading entire documents
                .lean();

            const tags = [...new Set(
                allPosts
                    .flatMap(p => p.blogTags ? p.blogTags.split(',').map(t => t.trim()) : [])
                    .filter(t => t.length > 0)
            )].slice(0, 15);
            // → flatMap: combine all tags from all posts into one array
            // → map(t => t.trim()): remove whitespace from each tag
            // → filter: remove empty strings
            // → new Set(): remove duplicates
            // → [...]: convert Set back to array
            // → .slice(0, 15): limit to 15 tags for the sidebar

            // Step 5: Render the blog listing page with all data
            res.render('client/pages/blog-listing', {
                title: 'Blog',
                currentPage: 'blog',
                blogs,
                categories: categoriesWithCount,
                popularPosts,
                tags,
                pagination: {
                    page,
                    totalPages,
                    totalPosts,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                currentCategory: null,
                searchQuery: null
            });

        } catch (error) {
            console.error('Blog Listing Error:', error.message);
            req.flash('error_msg', 'Failed to load blog posts.');
            res.redirect('/');
        }
    },


    // ─────────────────────────────────────────────────────────
    // single — Show a single blog post with comments
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /blog/:slug
    // EXAMPLE: GET /blog/my-first-post-1710234567890
    //
    // ALSO:
    //   - Increments the view counter
    //   - Loads approved comments
    //   - Loads related posts (same category)

    single: async (req, res) => {
        try {
            // Step 1: Find the blog post by its slug
            const blog = await Blog.findOne({
                slug: req.params.slug,
                status: 'published'
            })
                .populate('author', 'name avatar bio')
                .lean();

            // Step 2: If post not found, show 404
            if (!blog) {
                req.flash('error_msg', 'Blog post not found.');
                return res.redirect('/blog');
            }

            // Step 3: Increment the view counter
            // Using updateOne is more efficient than findOneAndUpdate
            // because we don't need the updated document back
            await Blog.updateOne(
                { _id: blog._id },
                { $inc: { views: 1 } }
                // → $inc atomically increments the field by 1
                // → "Atomic" means it's safe even with concurrent requests
                //   (two users viewing at the same time won't cause issues)
            );

            // Step 4: Load approved comments for this post
            const comments = await Comment.find({
                blog: blog._id,
                status: 'approved'
            })
                .sort({ createdAt: -1 })
                .lean();

            // Step 5: Load related posts (same category, exclude current post)
            const relatedPosts = await Blog.find({
                blogCategory: blog.blogCategory,
                status: 'published',
                _id: { $ne: blog._id }
                // → $ne = "not equal" — excludes the current post from results
            })
                .sort({ createdAt: -1 })
                .limit(4)
                .lean();

            // Step 6: Calculate estimated reading time
            const wordCount = blog.blogContent ? blog.blogContent.split(/\s+/).length : 0;
            // → split(/\s+/) splits by whitespace (spaces, tabs, newlines)
            const readingTime = Math.max(1, Math.ceil(wordCount / 200));
            // → Average reading speed: ~200 words per minute
            // → Math.max(1, ...) ensures minimum 1 minute

            // Step 7: Render the single blog post page
            res.render('client/pages/single-blog', {
                title: blog.blogTitle,
                currentPage: 'blog',
                blog,
                comments,
                relatedPosts,
                readingTime
            });

        } catch (error) {
            console.error('Single Blog Error:', error.message);
            req.flash('error_msg', 'Failed to load the blog post.');
            res.redirect('/blog');
        }
    },


    // ─────────────────────────────────────────────────────────
    // byCategory — Show posts filtered by category
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /category/:slug
    // EXAMPLE: GET /category/technology

    byCategory: async (req, res) => {
        try {
            // Step 1: Find the category by its slug
            const category = await Category.findOne({
                slug: req.params.slug
            }).lean();

            if (!category) {
                req.flash('error_msg', 'Category not found.');
                return res.redirect('/blog');
            }

            // Step 2: Pagination setup
            const page = parseInt(req.query.page) || 1;
            const limit = 6;
            const skip = (page - 1) * limit;

            // Step 3: Count and fetch posts in this category
            const totalPosts = await Blog.countDocuments({
                blogCategory: category.name,
                status: 'published'
            });
            const totalPages = Math.ceil(totalPosts / limit);

            const blogs = await Blog.find({
                blogCategory: category.name,
                status: 'published'
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'name avatar')
                .lean();

            // Step 4: Fetch sidebar data (same as listing)
            const categories = await Category.find().lean();
            const categoriesWithCount = await Promise.all(
                categories.map(async (cat) => {
                    const postCount = await Blog.countDocuments({
                        blogCategory: cat.name,
                        status: 'published'
                    });
                    return { ...cat, postCount };
                })
            );

            const popularPosts = await Blog.find({ status: 'published' })
                .sort({ views: -1 })
                .limit(5)
                .lean();

            // Step 5: Render the listing page with filtered results
            res.render('client/pages/blog-listing', {
                title: `${category.name} — Blog`,
                currentPage: 'blog',
                blogs,
                categories: categoriesWithCount,
                popularPosts,
                tags: [],
                pagination: {
                    page,
                    totalPages,
                    totalPosts,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                currentCategory: category.slug,
                searchQuery: null
            });

        } catch (error) {
            console.error('Category Filter Error:', error.message);
            req.flash('error_msg', 'Failed to filter by category.');
            res.redirect('/blog');
        }
    },


    // ─────────────────────────────────────────────────────────
    // search — Search posts by keyword
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /search?q=javascript
    // The search query is in the URL query string: req.query.q

    search: async (req, res) => {
        try {
            // Step 1: Get the search query from URL
            const searchQuery = req.query.q || '';

            // Step 2: If empty search, redirect to blog listing
            if (!searchQuery.trim()) {
                return res.redirect('/blog');
            }

            // Step 3: Pagination
            const page = parseInt(req.query.page) || 1;
            const limit = 6;
            const skip = (page - 1) * limit;

            // Step 4: Build the search filter using MongoDB $regex
            const searchFilter = {
                status: 'published',
                $or: [
                    // → $or means: match ANY of these conditions
                    { blogTitle: { $regex: searchQuery, $options: 'i' } },
                    // → Search in title. $options: 'i' = case-insensitive.
                    // → "javascript" matches "JavaScript", "JAVASCRIPT", etc.
                    { blogExcerpt: { $regex: searchQuery, $options: 'i' } },
                    // → Also search in excerpt
                    { blogContent: { $regex: searchQuery, $options: 'i' } },
                    // → Also search in full content
                    { blogTags: { $regex: searchQuery, $options: 'i' } },
                    // → Also search in tags
                    { blogCategory: { $regex: searchQuery, $options: 'i' } }
                    // → Also search in category name
                ]
            };

            // Step 5: Count and fetch matching posts
            const totalPosts = await Blog.countDocuments(searchFilter);
            const totalPages = Math.ceil(totalPosts / limit);

            const blogs = await Blog.find(searchFilter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'name avatar')
                .lean();

            // Step 6: Fetch sidebar data
            const categories = await Category.find().lean();
            const categoriesWithCount = await Promise.all(
                categories.map(async (cat) => {
                    const postCount = await Blog.countDocuments({
                        blogCategory: cat.name,
                        status: 'published'
                    });
                    return { ...cat, postCount };
                })
            );

            const popularPosts = await Blog.find({ status: 'published' })
                .sort({ views: -1 })
                .limit(5)
                .lean();

            // Step 7: Render the listing page with search results
            res.render('client/pages/blog-listing', {
                title: `Search: "${searchQuery}"`,
                currentPage: 'blog',
                blogs,
                categories: categoriesWithCount,
                popularPosts,
                tags: [],
                pagination: {
                    page,
                    totalPages,
                    totalPosts,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                currentCategory: null,
                searchQuery
            });

        } catch (error) {
            console.error('Search Error:', error.message);
            req.flash('error_msg', 'Search failed. Please try again.');
            res.redirect('/blog');
        }
    },


    // ─────────────────────────────────────────────────────────
    // addComment — Post a comment on a blog post
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /blog/:id/comment
    // PROTECTED: isAuthenticated middleware (must be logged in)

    addComment: async (req, res) => {
        try {
            // Step 1: Find the blog post by ID
            const blog = await Blog.findById(req.params.id);

            if (!blog) {
                req.flash('error_msg', 'Blog post not found.');
                return res.redirect('/blog');
            }

            // Step 2: Validate the comment content
            const { content } = req.body;

            if (!content || !content.trim()) {
                req.flash('error_msg', 'Comment cannot be empty.');
                return res.redirect(`/blog/${blog.slug}`);
            }

            // Step 3: Create the comment
            await Comment.create({
                content: content.trim(),
                authorName: req.user.name,
                // → req.user is the logged-in user (set by Passport)
                authorEmail: req.user.email,
                blog: blog._id,
                status: 'pending'
                // → New comments start as 'pending' — admin must approve
            });

            // Step 4: Show success message and redirect back to the post
            req.flash('success_msg', 'Your comment has been submitted and is awaiting approval.');
            res.redirect(`/blog/${blog.slug}`);

        } catch (error) {
            console.error('Add Comment Error:', error.message);
            req.flash('error_msg', 'Failed to submit your comment.');
            res.redirect('/blog');
        }
    }
};


export default blogController;