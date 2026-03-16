// ═══════════════════════════════════════════════════════════════════════
// public/js/client.js — CLIENT-SIDE JAVASCRIPT
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Handles interactive behavior on the public blog website:
//   - Auto-dismiss flash messages after 5 seconds
//   - Smooth scroll behavior
//   - Navbar scroll effect (add shadow on scroll)
//   - Form validation helpers
//
// HOW IT CONNECTS:
// Loaded in views/client/partials/footer.ejs:
//   <script src="/js/client.js"></script>
// Runs in the BROWSER (not on the server).
//
// ═══════════════════════════════════════════════════════════════════════


document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────────────
    // Feature 1: Auto-dismiss flash messages
    // ─────────────────────────────────────────────────────
    // Flash messages appear at the top of the page.
    // We automatically hide them after 5 seconds so they
    // don't clutter the interface.

    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            setTimeout(() => msg.remove(), 500);
        }, 5000);
    });


    // ─────────────────────────────────────────────────────
    // Feature 2: Navbar shadow on scroll
    // ─────────────────────────────────────────────────────
    // When the user scrolls down, add a shadow to the navbar
    // to give it a "floating" effect and visual separation.

    const navbar = document.querySelector('.client-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('shadow-sm');
            } else {
                navbar.classList.remove('shadow-sm');
            }
        });
    }


    // ─────────────────────────────────────────────────────
    // Feature 3: Smooth scroll for anchor links
    // ─────────────────────────────────────────────────────
    // If a link points to an anchor on the same page (#section),
    // scroll smoothly instead of jumping instantly.

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ─────────────────────────────────────────────────────
    // Feature 4: Search form validation
    // ─────────────────────────────────────────────────────
    // Prevent submitting an empty search query.

    const searchForms = document.querySelectorAll('form[action="/search"]');
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const input = form.querySelector('input[name="q"]');
            if (input && !input.value.trim()) {
                e.preventDefault();
                input.classList.add('is-invalid');
                input.focus();
                setTimeout(() => input.classList.remove('is-invalid'), 2000);
            }
        });
    });

});