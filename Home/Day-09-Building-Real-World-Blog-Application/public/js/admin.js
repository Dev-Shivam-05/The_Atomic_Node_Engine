// ═══════════════════════════════════════════════════════════════════════
// public/js/admin.js — ADMIN DASHBOARD JAVASCRIPT
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles interactive features on the admin dashboard:
//   - Mobile sidebar toggle
//   - Confirmation dialogs for delete actions
//   - Auto-dismiss flash messages
//   - Image preview on file upload
//
// HOW IT CONNECTS:
// Loaded in views/admin/partials/footer.ejs:
//   <script src="/js/admin.js"></script>
//
// ═══════════════════════════════════════════════════════════════════════


document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────────────
    // Feature 1: Mobile Sidebar Toggle
    // ─────────────────────────────────────────────────────
    // On mobile screens, the sidebar is hidden by default.
    // The toggle button shows/hides it with a slide animation.

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            if (overlay) overlay.classList.toggle('show');
        });

        // Close sidebar when clicking the overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            });
        }
    }


    // ─────────────────────────────────────────────────────
    // Feature 2: Delete Confirmation Dialogs
    // ─────────────────────────────────────────────────────
    // All delete links have the class 'delete-confirm'.
    // We intercept clicks and show a confirmation dialog.

    document.querySelectorAll('.delete-confirm').forEach(link => {
        link.addEventListener('click', (e) => {
            const itemName = link.dataset.name || 'this item';
            if (!confirm(`Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`)) {
                e.preventDefault();
            }
        });
    });


    // ─────────────────────────────────────────────────────
    // Feature 3: Auto-dismiss flash messages
    // ─────────────────────────────────────────────────────

    const flashMessages = document.querySelectorAll('.admin-flash .alert');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            setTimeout(() => msg.remove(), 500);
        }, 5000);
    });


    // ─────────────────────────────────────────────────────
    // Feature 4: Image Preview on Upload
    // ─────────────────────────────────────────────────────
    // When the admin selects a file in the image upload input,
    // show a preview of the selected image before submitting.

    const imageInput = document.getElementById('blogImage');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    imageInput.value = '';
                    return;
                }

                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image must be less than 5MB.');
                    imageInput.value = '';
                    return;
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.src = event.target.result;
                    imagePreview.style.display = 'block';
                    imagePreview.classList.add('mt-3', 'rounded-3', 'shadow-sm');
                    imagePreview.style.maxHeight = '200px';
                    imagePreview.style.objectFit = 'cover';
                };
                reader.readAsDataURL(file);
            }
        });
    }

});