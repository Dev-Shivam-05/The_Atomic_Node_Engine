# Admin Panel To‑Do CRUD

## Overview
This project is a Node.js + Express + EJS admin panel that manages a movie list with full CRUD, image uploads, and role‑based access for Admin and User flows. It uses MongoDB (via Mongoose) for persistence and renders server‑side views with EJS templates.

## Tech Stack
- Backend: Node.js, Express (ESM)
- Views: EJS templates
- Database: MongoDB with Mongoose
- File uploads: Multer
- Logging: Morgan
- Cookies: cookie-parser
- Styling/UI assets: Bootstrap, jQuery plugins, and template assets in public

## Project Structure
- config
  - dotenv.js: Loads environment variables
  - db.js: Connects to MongoDB
- controllers
  - admin.controller.js: Admin pages and add/view flows
  - home.controller.js: Login page, login handling, and user home page
  - movie.controller.js: Movie CRUD actions and image updates
- middleware
  - authentication.js: Auth and admin‑only protection
  - imageUpload.js: Multer storage for poster uploads
- models
  - movieModel.js: Mongoose schema for movies
- routers
  - index.js: Aggregates app routes
  - home.route.js: Login and user home
  - admin.route.js: Admin page, add movie, view movie
  - movie.route.js: Movie CRUD endpoints
- views
  - pages: authentication, admin dashboard, add/edit/view movie
  - partials: header/footer used by pages
- public
  - Static assets (CSS, JS, images, plugins)
- uploads
  - Uploaded posters (served at /uploads)

## Environment Variables
Create a `.env` file in the project root:
- PORT: Server port (default 3000 if not set)
- MONGO_URL: MongoDB connection string

Example:
```
PORT=8081
MONGO_URL=mongodb://localhost:27017/admin-side-movie
```

## How Authentication Works
This project uses a simple cookie‑based role object for demo purposes:
- Login page is at `/`
- On successful login:
  - Admin credentials set a cookie with role `admin` and redirect to `/admin`
  - User credentials set a cookie with role `user` and redirect to `/home`
- Auth middleware reads the cookie, attaches `req.user`, and guards protected routes
- Admin middleware allows only role `admin`, otherwise redirects to `/home`

Demo Credentials:
- Admin: `admin1 / adminpassword`
- User: `user1 / userpassword`

## Application Flow
1. Visitor opens `/` and sees the login page
2. Login form posts to `/authenticate/visitor`
3. If credentials match:
   - Admin goes to `/admin`
   - User goes to `/home`
4. Protected routes require a valid auth cookie:
   - User home `/home`
   - Admin dashboard `/admin`
   - Movie management endpoints under `/movie`

## Routes
### Public
- GET `/` → Login page
- POST `/authenticate/visitor` → Login handler

### User
- GET `/home` → User home page (movie list view)

### Admin
- GET `/admin` → Admin dashboard
- GET `/admin/add-movie` → Add movie form
- GET `/admin/view-movie` → Admin movie table

### Movie CRUD (Admin‑only)
- POST `/movie/add-movie` → Create movie with poster upload
- GET `/movie/edit-movie/:id` → Edit form
- POST `/movie/edit-movie/:id` → Update movie with optional poster
- POST `/movie/delete-movie/:id` → Delete movie and poster

## Movie Data Model
Movies use this schema:
- movieTitle: String, required
- genre: String enum (Action, Comedy, Drama, Horror, Sci‑Fi)
- rating: Number (1 to 5)
- movieDescription: String
- movieRelease: Date
- movieDuration: Number (stored as minutes)
- poster: String (file path)

## File Uploads
- Poster files are stored under `uploads/`
- The server exposes `/uploads` as a static path
- When a movie is updated with a new poster, the old file is removed

## Running the Project
1. Install dependencies
   ```
   npm install
   ```
2. Start MongoDB locally or update `MONGO_URL`
3. Run the server
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```
4. Open `http://localhost:3000/` (or your PORT)

## Scripts
- `npm run dev` → Start with nodemon
- `npm start` → Start with node
- `npm test` → Placeholder script

## Notes
- This project uses EJS server‑side rendering for views
- Authentication is intentionally simple for demo purposes
- UI assets are stored under `public/`
