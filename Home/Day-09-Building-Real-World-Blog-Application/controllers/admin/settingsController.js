// ═══════════════════════════════════════════════════════════════════════
// controllers/admin/settingsController.js — ADMIN SETTINGS
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles the admin settings page where the admin can update their
// profile information (name, email, bio, password).
//
// HOW IT CONNECTS:
// routes/adminRoutes.js:
//   GET  /admin/settings → index
//   POST /admin/settings → update
//
// ═══════════════════════════════════════════════════════════════════════


import User from '../../models/User.js';
import bcrypt from 'bcryptjs';


const settingsController = {

    // ─────────────────────────────────────────────────────────
    // index — Show the settings page
    // ─────────────────────────────────────────────────────────
    // ROUTE: GET /admin/settings

    index: (req, res) => {
        res.render('admin/pages/settings', {
            title: 'Settings'
        });
        // → req.user (the logged-in admin) is already available
        //   in the view as 'currentUser' via flashMiddleware
    },


    // ─────────────────────────────────────────────────────────
    // update — Process the settings form
    // ─────────────────────────────────────────────────────────
    // ROUTE: POST /admin/settings

    update: async (req, res) => {
        try {
            const { name, email, bio, currentPassword, newPassword, confirmNewPassword } = req.body;

            // Step 1: Find the current user
            const user = await User.findById(req.user._id);

            if (!user) {
                req.flash('error_msg', 'User not found.');
                return res.redirect('/admin/settings');
            }

            // Step 2: Update basic info
            if (name && name.trim()) {
                user.name = name.trim();
            }

            if (email && email.trim()) {
                // Check if new email is already used by another user
                const emailExists = await User.findOne({
                    email: email.toLowerCase().trim(),
                    _id: { $ne: user._id }
                    // → $ne: exclude current user from the check
                });

                if (emailExists) {
                    req.flash('error_msg', 'This email is already in use by another account.');
                    return res.redirect('/admin/settings');
                }

                user.email = email.toLowerCase().trim();
            }

            if (bio !== undefined) {
                user.bio = bio.trim();
            }

            // Step 3: Handle password change (optional)
            if (currentPassword && newPassword) {
                // Step 3a: Verify current password
                const isMatch = await bcrypt.compare(currentPassword, user.password);

                if (!isMatch) {
                    req.flash('error_msg', 'Current password is incorrect.');
                    return res.redirect('/admin/settings');
                }

                // Step 3b: Validate new password
                if (newPassword.length < 6) {
                    req.flash('error_msg', 'New password must be at least 6 characters.');
                    return res.redirect('/admin/settings');
                }

                if (newPassword !== confirmNewPassword) {
                    req.flash('error_msg', 'New passwords do not match.');
                    return res.redirect('/admin/settings');
                }

                // Step 3c: Set new password (pre-save hook will hash it)
                user.password = newPassword;
            }

            // Step 4: Save the updated user
            await user.save();
            // → Pre-save hook in User.js will hash the password if it was changed

            req.flash('success_msg', 'Settings updated successfully!');
            res.redirect('/admin/settings');

        } catch (error) {
            console.error('Settings Update Error:', error.message);
            req.flash('error_msg', 'Failed to update settings.');
            res.redirect('/admin/settings');
        }
    }
};


export default settingsController;