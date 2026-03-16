# BlogEngine - Technical Specification & Documentation

## 1. System Overview
BlogEngine is a robust, secure, and professional blogging platform built with the MVC (Model-View-Controller) architecture. It features a tiered user management system, secure authentication, and real-time interaction capabilities.

## 2. User Roles & Permissions

### 2.1 Visitor
*   **Definition:** Any non-authenticated guest.
*   **Permissions:**
    *   View public blog posts.
    *   Read blog details.
    *   View landing page statistics.
    *   Register for a new account.
    *   Access the login portal.

### 2.2 User
*   **Definition:** An authenticated member of the platform.
*   **Permissions:**
    *   All **Visitor** permissions.
    *   Create, Edit, and Delete their own blog posts.
    *   Like/Unlike any blog post.
    *   Comment on any blog post.
    *   Access a personal Dashboard.
    *   Update their profile (Username, Bio, Profile Picture).

### 2.3 Admin
*   **Definition:** A platform administrator with elevated privileges.
*   **Permissions:**
    *   All **User** permissions.
    *   Access the **Admin Dashboard** with global statistics.
    *   **Full User Management (CRUD):**
        *   View all registered users.
        *   Create new users (including other admins).
        *   Edit any user's profile and role.
        *   Delete any user (with confirmation).
        *   View detailed activity profiles for any user.

---

## 3. Authentication & Security

### 3.1 Mechanism
The system uses **Passport.js** with the **Local Strategy** for session-based authentication.
*   **Admin Credentials:**
    *   **Default Username:** `Admin` (Set during manual creation or via Admin Panel)
    *   **Default Email:** `admin@blogengine.com`
    *   **Password Requirements:** Minimum 6 characters, hashed using **bcrypt** (10 salt rounds).
*   **Session Management:** Handled via `express-session` with secure cookies.
*   **Security Features:**
    *   **CSRF Protection:** Using `csurf` to prevent cross-site request forgery.
    *   **Rate Limiting:** Protects auth endpoints from brute-force attacks.
    *   **Security Headers:** Implemented via `helmet.js`.
    *   **Input Validation:** Using `express-validator` for all forms.

---

## 4. Technical Architecture

### 4.1 Database Schema (MongoDB/Mongoose)
*   **User:** Stores credentials, profile info, and `role` (enum: user, admin).
*   **Blog:** Stores content, category, author reference, and engagement counts.
*   **Like:** Tracks user-blog relationships (unique compound index).
*   **Comment:** Stores user feedback on specific blogs.

### 4.2 Image Management System
*   **Uploads:** Handled by `multer`.
*   **Optimization:** Uses the `sharp` library.
    *   **Resizing:** All profile pictures are resized to 300x300 pixels.
    *   **Optimization:** Converted to `.webp` format with 80% quality for faster loading.
    *   **Validation:** Restricted to 2MB and common image formats (JPEG, PNG, WebP).

---

## 5. API Endpoints (Brief Overview)
*   `/login`, `/register`, `/logout`: Authentication flows.
*   `/blog/add`, `/blog/edit/:id`, `/blog/delete/:id`: Content management.
*   `/blog/like/:id`, `/blog/comment/:id`: Engagement.
*   `/admin/users/*`: User management (Admin only).
*   `/user/profile/update`: Profile management.

## 6. Setup & Deployment
1.  **Install dependencies:** `npm install`
2.  **Environment Variables:** Configure `.env` with `MONGODB_URL`, `SESSION_SECRET`, and `PORT`.
3.  **Run Development:** `npm run dev`
4.  **Run Tests:** `npm test`

---
*Documentation generated for BlogEngine v1.0.0*
https://the-atomic-node-engine-1.onrender.com