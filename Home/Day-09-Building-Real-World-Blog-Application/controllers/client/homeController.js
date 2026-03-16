// ═══════════════════════════════════════════════════════════════════════
// controllers/client/homeController.js — HOME PAGE CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles the logic for the home page (/).
// It fetches featured posts, latest posts, categories with post counts,
// and total statistics — then passes all that data to the home view.
//
// HOW IT CONNECTS:
// routes/clientRoutes.js → router.get('/', homeController.index)
// → This controller runs → queries models → renders views/client/pages/home.ejs
//
// ═══════════════════════════════════════════════════════════════════════


// Step 1: Import the Models we need to query data from MongoDB
import Blog from '../../models/Blog.js';
import Category from '../../models/Category.js';
import User from '../../models/User.js';


// Step 2: Define the controller object with all handler methods
// WHY an object? Because we export it as a default export, and
// the route file accesses methods like: homeController.index
const homeController = {

    // ─────────────────────────────────────────────────────────
    // index — Render the Home Page
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /
    // WHAT: Fetches all data needed for the home page and renders it.
    //
    // DATA FETCHED:
    //   1. Featured post (or latest post as fallback)
    //   2. Latest 6 published blog posts
    //   3. All categories with their post counts
    //   4. Total statistics (posts, categories, authors)

    index: async (req, res) => {
        try {
            // Step 3: Fetch the featured post
            // First, try to find a post explicitly marked as featured.
            // If none exists, fall back to the most recent published post.
            let featuredPost = await Blog.findOne({
                status: 'published',
                featured: true
            })
                .populate('author', 'name avatar')
                // → .populate('author', 'name avatar') replaces the author ObjectId
                //   with the actual user document, but ONLY the name and avatar fields.
                //   Without populate: author = "65f1a2b3c4d5e6f7" (just an ID)
                //   With populate:    author = { _id: "...", name: "Admin", avatar: "..." }
                .lean();
                // → .lean() returns a plain JS object instead of a Mongoose document.
                //   This is faster because Mongoose doesn't add change tracking,
                //   getters, setters, or methods. We only need the data for display.

            // Step 4: If no featured post found, use the latest post instead
            if (!featuredPost) {
                featuredPost = await Blog.findOne({ status: 'published' })
                    .sort({ createdAt: -1 })
                    // → Sort by createdAt descending (-1 = newest first)
                    .populate('author', 'name avatar')
                    .lean();
            }

            // Step 5: Fetch the latest 6 published posts (for the grid section)
            const latestBlogs = await Blog.find({ status: 'published' })
                .sort({ createdAt: -1 })
                .limit(6)
                // → Only get the 6 most recent posts
                .populate('author', 'name avatar')
                .lean();

            // Step 6: Fetch all categories and count posts in each
            const categories = await Category.find().lean();

            // Step 6b: For each category, count how many published posts it has
            // WHY: We display "Technology (24 posts)" in the categories section
            const categoriesWithCount = await Promise.all(
                categories.map(async (cat) => {
                    const postCount = await Blog.countDocuments({
                        blogCategory: cat.name,
                        status: 'published'
                    });
                    // → countDocuments is more efficient than find().length
                    //   because it only counts without loading full documents
                    return { ...cat, postCount };
                    // → Spread operator merges the category data with the count:
                    //   { name: "Technology", icon: "💻", ..., postCount: 24 }
                })
            );
            // → Promise.all runs all count queries in PARALLEL (not sequentially),
            //   which is much faster when there are many categories.

            // Step 7: Fetch total statistics for the stats bar
            const totalBlogs = await Blog.countDocuments({ status: 'published' });
            const totalCategories = await Category.countDocuments();
            const totalAuthors = await User.countDocuments();

            // Step 8: Render the home page view with all the collected data
            res.render('client/pages/home', {
                title: 'Home',
                currentPage: 'home',
                // → Used by navbar to highlight the active link

                featuredPost,
                latestBlogs,
                categories: categoriesWithCount,
                totalBlogs,
                totalCategories,
                totalAuthors
                // → All these variables are now accessible inside home.ejs
                //   Example: <% latestBlogs.forEach(blog => { %> ... <% }) %>
            });

        } catch (error) {
            // Step 9: Handle any errors (DB connection issues, etc.)
            console.error('Home Page Error:', error.message);
            req.flash('error_msg', 'Something went wrong loading the home page.');
            res.redirect('/blog');
            // → Redirect to blog listing as a safe fallback
        }
    }
};


// Step 10: Export the controller as default export
// This is what clientRoutes.js imports:
//   import homeController from '../controllers/client/homeController.js';
export default homeController;