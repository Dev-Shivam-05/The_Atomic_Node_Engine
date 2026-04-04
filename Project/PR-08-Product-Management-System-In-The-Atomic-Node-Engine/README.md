# Product Management System - The Atomic Node Engine

Live Preview: [https://product-management-system-q0bp.onrender.com/](https://product-management-system-q0bp.onrender.com/)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://product-management-system-q0bp.onrender.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green)](https://nodejs.org/)

A robust, full-stack product management system designed with a dual-interface approach: a powerful Admin Dashboard for inventory management and a modern, responsive User Panel for product discovery.

---

## 1. Visual Layer

The application features a clean, professional aesthetic with a focus on usability and clarity.

| Attribute | Specification |
| :--- | :--- |
| **Primary Palette** | Soft Greys (`#f8f9fa`), Pastel Blues (`#e3f2fd`), Light Sand (`#fdf5e6`) |
| **Typography** | Sans-serif (Segoe UI, Roboto, Helvetica) |
| **UI Components** | Bootstrap 5 Cards, Modals, Breadcrumbs, Sidebars |
| **Spacing** | 8px/16px/24px grid system |
| **Breakpoints** | Mobile (<576px), Tablet (576px-992px), Desktop (>992px) |
| **Animations** | Hover lift effects, CSS transitions for modals |
| **Icons** | FontAwesome / Bootstrap Icons |
| **Accessibility** | ARIA labels, semantic HTML, WCAG 2.1 AA contrast compliance |

---

## 2. Functional Layer

### User Interactions
- **Product Discovery**: Browse items in a responsive card grid with hover effects.
- **Detailed View**: Click "View Details" to open a full-screen modal with high-res carousels.
- **Inventory Management (Admin)**: Create, Read, Update, and Delete (CRUD) categories, sub-categories, and products.
- **Authentication**: Secure registration and login flows with email verification.

### Validation & States
- **Forms**: Field-level validation (e.g., min length for category names/descriptions).
- **Error Handling**: Real-time alerts for failed API requests or invalid inputs.
- **Loading**: Skeleton loaders provide visual feedback during data fetching.

---

## 3. Data Layer

The system uses a relational MongoDB schema designed for high-performance retrieval.

| Entity | Attributes | Relationships |
| :--- | :--- | :--- |
| **Category** | `categoryName`, `categoryDescription`, `Image` | One-to-Many with SubCategory |
| **SubCategory** | `subcategoryName`, `categoryId`, `Image` | Belongs to Category |
| **Product** | `productName`, `productPrice`, `productDescription`, `productQuantity`, `productImage`, `productCategory`, `productSubcategory` | Belongs to Category & SubCategory |
| **User** | `username`, `email`, `password`, `isVerified`, `role` | Can be 'admin' or 'user' |

---

## 4. Technical Layer

### Tech Stack
- **Frontend**: EJS (Embedded JavaScript), CSS3 (SCSS), Bootstrap 5.3, Vanilla JavaScript.
- **Backend**: Node.js, Express.js (v5.2.1).
- **Database**: MongoDB via Mongoose (v9.3.0).
- **Authentication**: JSON Web Tokens (JWT), Bcrypt for hashing.
- **Utilities**: Multer for image uploads, Nodemailer for OTP emails.

### API Endpoints (Core)
- `POST /api/user/login` - Authenticate user and return JWT.
- `GET /api/product` - Fetch all products (cached).
- `POST /api/category` - Create a category (Admin only).
- `PATCH /api/category/:id` - Update a category (Admin only).

---

## 5. Content Layer

The tone of the application is professional yet accessible. 

- **Labels**: "Category Name", "Product Price", "Stock Status".
- **Microcopy**: "Your toy box is empty!", "Magic Toy Store - Explore Our Collection".
- **Language**: English (US).
- **Meta Tags**: SEO-optimized titles and descriptions for the product catalogue.

---

## 6. Performance Layer

- **Load Time**: Optimized through server-side rendering (EJS) and client-side caching.
- **Caching**: 5-minute TTL on product data stored in `sessionStorage`.
- **Assets**: Lazy-loaded images to reduce initial bundle size.
- **Optimization**: Minified Bootstrap CSS/JS via CDN or local vendor files.

---

## 7. Security Layer

- **Auth**: JWT-based stateless authentication.
- **Storage**: Password hashing using Bcrypt (10 rounds).
- **Privacy**: `dotenv` for managing sensitive environment variables (`MONGODB_URL`, `JWT_SECRET`).
- **Headers**: CORS enabled for API endpoints; secure HTTP headers.

---

## 8. Repository Structure

```text
The_Atomic_Node_Engine/
├── config/             # DB and Env configurations
├── controllers/        # Business logic for API and Views
├── middleware/         # Auth and Image upload logic
├── models/             # Mongoose schemas
├── public/             # Static assets (CSS, JS, Images)
├── routes/             # Express route definitions
├── views/              # EJS templates
│   ├── pages/          # Full page templates
│   └── partials/       # Reusable UI components
├── .env                # Environment variables
├── index.js            # Server entry point
└── package.json        # Dependencies and scripts
```

---

## 9. Setup Instructions

### Environment Preparation
1. Clone the repository.
2. Install [Node.js](https://nodejs.org/) (v18+).
3. Set up a [MongoDB](https://www.mongodb.com/atlas/database) instance.

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root:
```env
PORT=8081
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
USER_KEY=your_email_app_password
```

### Running the App
```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 10. Testing Checklist

- [ ] **Unit Tests**: Validate password hashing and JWT token generation.
- [ ] **Integration Tests**: Verify CRUD operations on Categories/Products.
- [ ] **E2E Tests**: Simulate a full user journey from registration to product checkout.
- [ ] **Edge Cases**: Test image uploads with invalid file types; test duplicate category names.

---

## 11. Contribution Guide

1. **Branching**: Use `feature/` for new features and `fix/` for bug fixes.
2. **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/).
3. **Pull Requests**: Provide a clear description and link to relevant issues.
4. **Style**: Follow standard ESLint rules for JavaScript.

---

## 12. Roadmap & Changelog

### Roadmap
- [ ] **Q3 2026**: Implement real-time inventory updates via WebSockets.
- [ ] **Q4 2026**: Add multi-currency support and payment gateway integration.

### Changelog
- **v1.0.0 (2026-03-30)**: Initial release with Admin CRUD and User Catalogue.

---

**Author**: The Atomic Node Team  
**License**: ISC  
**Copyright**: © 2026 All Rights Reserved.
