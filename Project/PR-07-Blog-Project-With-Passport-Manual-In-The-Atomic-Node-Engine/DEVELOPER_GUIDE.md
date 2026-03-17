# Developer Implementation Guide: Blog Engine v2.0

This guide provides a strict, step-by-step implementation sequence for building the Blog Engine. Follow this order exactly to ensure all dependencies and configurations are available when needed.

---

## Phase 1: Environment & Foundation

### 1.1 Project Initialization
1.  **Initialize Node.js:** `npm init -y`
2.  **Install Core Dependencies:** 
    `npm install express mongoose ejs express-session passport passport-local bcrypt multer sharp dotenv morgan cookie-parser helmet express-rate-limit express-validator connect-flash`
3.  **Install Development Tool:** `npm install --save-dev nodemon`

### 1.2 Configuration Files
1.  **`.env`:** Create this file first to store sensitive keys (`PORT`, `MONGODB_URL`, `SESSION_SECRET`).
2.  **`config/database.js`:** Establish the Mongoose connection to your MongoDB instance.
3.  **`config/dotenv.js`:** Create a helper to export environment variables safely.

---

## Phase 2: Data Architecture (Models)

Create the following files in the `models/` folder:
1.  **`user.model.js`:** Define schema for users (Name, Email, Hashed Password, ProfilePic, Role).
2.  **`blog.model.js`:** Define schema for posts (Title, Excerpt, Content, Image, Author ID, Like/Comment counts).
3.  **`like.model.js`:** Define a compound relationship model between Users and Blogs.
4.  **`comment.model.js`:** Define the feedback schema linked to Blogs and Users.

---

## Phase 3: Middleware & Security

1.  **`middleware/imageUpload.js`:** 
    *   Configure `multer` for memory storage.
    *   Implement `sharp` logic to resize images to 300x300 and convert to `.webp`.
2.  **`middleware/auth.middleware.js`:** 
    *   `ensureAuthenticated`: Protects routes for logged-in users.
    *   `isAdmin`: Restricts access to the Admin Dashboard.
3.  **`config/passport-local-strategy.js`:**
    *   Implement **Hard-coded Admin** logic (Username: `admin`, Password: `admin123`).
    *   Implement **Regular User** lookup from MongoDB using `bcrypt.compare`.

---

## Phase 4: Core Logic (Controllers)

Implement the controllers in this specific order:
1.  **`auth.controller.js`:** Handles `postRegister` (with image processing) and `postLogin`.
2.  **`blog.controller.js`:** 
    *   Implement `createBlog` and `updateBlog`.
    *   **Delete Cleanup:** Use `fs.unlinkSync` to erase image files from the disk when a post is removed.
    *   **Like Logic:** Fix the AJAX endpoint to return the latest `likeCount`.
3.  **`user.controller.js`:** Manage the **User Dashboard** and profile customization.
4.  **`admin.controller.js`:** Global management CRUD and the **Admin Command Center**.

---

## Phase 5: Routing & Entry

1.  **`routers/index.js`:** The master router that combines all feature-specific routes.
2.  **Feature Routers:** Create `auth.route.js`, `blog.route.js`, `user.route.js`, and `admin.route.js`.
3.  **`index.js` (Root):**
    *   Initialize Express.
    *   Configure `express-session` (Cookie-based).
    *   Set up static folders (`public`, `uploads`).
    *   Global `res.locals` middleware for user state.

---

## Phase 6: User Interface (Views)

1.  **Redesigned `public/css/theme.css`:** Set up modern CSS variables and card styles to prevent stretching.
2.  **Partials:** Create `header.ejs` and `footer.ejs` for layout consistency.
3.  **Pages:** 
    *   Build `register.ejs` with the new **Image Input Box** and real-time preview.
    *   Build the overhauled **User Dashboard** with the redesigned sidebar.
    *   Build the **Admin Command Center** with its distinct gradient-based layout.

---

## Phase 7: Verification

1.  **Start Server:** `npm run dev`
2.  **Test Registration:** Upload a profile picture and verify it appears in `uploads/profiles/`.
3.  **Test Hard-coded Admin:** Login with `admin` / `admin123`.
4.  **Test Like:** Click the heart icon on a blog post and verify the count updates without a page refresh.
5.  **Test Cleanup:** Delete a blog post and check the `uploads/` folder to ensure the file is gone.
