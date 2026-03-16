// ═══════════════════════════════════════════════════════════════════════
// controllers/client/pageController.js — STATIC PAGES CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles static/informational pages: About and Contact.
// These pages don't require complex database queries — they're mostly
// about rendering templates with minimal dynamic data.
//
// HOW IT CONNECTS:
// routes/clientRoutes.js:
//   GET  /about   → pageController.about
//   GET  /contact → pageController.contact
//   POST /contact → pageController.submitContact
//
// ═══════════════════════════════════════════════════════════════════════


import Blog from '../../models/Blog.js';
import User from '../../models/User.js';


const pageController = {

    // ─────────────────────────────────────────────────────────
    // about — Render the About page
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /about

    about: async (req, res) => {
        try {
            // Step 1: Fetch some stats to display on the about page
            const totalPosts = await Blog.countDocuments({ status: 'published' });
            const totalAuthors = await User.countDocuments();

            // Step 2: Fetch all authors (users) for the team section
            const authors = await User.find()
                .select('name avatar bio role')
                // → .select() only fetches specified fields (security + performance)
                // → We don't want to send password hashes to the view!
                .lean();

            // Step 3: Render the about page
            res.render('client/pages/about', {
                title: 'About Us',
                currentPage: 'about',
                totalPosts,
                totalAuthors,
                authors
            });

        } catch (error) {
            console.error('About Page Error:', error.message);
            req.flash('error_msg', 'Failed to load the about page.');
            res.redirect('/');
        }
    },


    // ─────────────────────────────────────────────────────────
    // contact — Render the Contact page (GET)
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /contact

    contact: (req, res) => {
        res.render('client/pages/contact', {
            title: 'Contact Us',
            currentPage: 'contact'
        });
    },


    // ─────────────────────────────────────────────────────────
    // submitContact — Process the contact form (POST)
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /contact
    //
    // NOTE: In a real production app, you'd send an email here
    // using a service like Nodemailer, SendGrid, or Mailgun.
    // For now, we validate the input and show a success message.

    submitContact: (req, res) => {
        // Step 1: Extract form data
        const { name, email, subject, message } = req.body;

        // Step 2: Validate required fields
        if (!name || !email || !message) {
            req.flash('error_msg', 'Please fill in all required fields.');
            return res.redirect('/contact');
        }

        // Step 3: Validate email format (basic check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error_msg', 'Please enter a valid email address.');
            return res.redirect('/contact');
        }

        // Step 4: In production, you would send an email here:
        // await sendEmail({ to: 'admin@blog.com', from: email, subject, body: message });

        // Step 5: Show success message
        req.flash('success_msg', 'Thank you for your message! We will get back to you soon.');
        res.redirect('/contact');
    }
};


export default pageController;