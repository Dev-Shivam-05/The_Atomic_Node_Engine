// ═══════════════════════════════════════════════════════════════════════
// config/multer.js — FILE UPLOAD CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Configures Multer — a middleware for handling multipart/form-data,
// which is the encoding type used for file uploads in HTML forms.
//
// When a user uploads a blog image through a form, Multer:
//   1. Intercepts the incoming file from the request
//   2. Validates it (only images allowed, max 5MB)
//   3. Generates a unique filename (prevents conflicts)
//   4. Saves it to public/uploads/ on disk
//   5. Makes file info available as req.file in the controller
//
// HOW IT CONNECTS:
// Imported in adminRoutes.js and used as route-level middleware:
//   router.post('/posts/create', upload.single('blogImage'), controller.create);
//
// After Multer processes the upload:
//   req.file.filename → "blog-1710234567890-123456789.jpg"
//   The controller uses this to save the path in the database.
//
// ═══════════════════════════════════════════════════════════════════════


import multer from 'multer';
import path from 'path';


// ─────────────────────────────────────────────────────────────
// Step 1: Configure storage — WHERE and HOW files are saved
// ─────────────────────────────────────────────────────────────
// diskStorage means files are written directly to the hard drive.
// (The alternative, memoryStorage, keeps files in RAM — not ideal
//  for large images as it can cause memory issues.)

const storage = multer.diskStorage({

    // Step 1a: Set the destination folder
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
        // → cb(error, folderPath)
        // → null = no error
        // → Files saved to public/uploads/
        // → Since Express serves 'public/' as static (server.js Step 10),
        //   uploaded files are accessible at /uploads/filename.jpg
    },

    // Step 1b: Generate a unique filename
    filename: (req, file, cb) => {
        // Create unique name: blog-{timestamp}-{random}.{ext}
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        // → path.extname('my-photo.JPG') → '.JPG'

        cb(null, `blog-${uniqueSuffix}${extension}`);
        // → Example: blog-1710234567890-482937561.jpg
        // → Timestamp + random number = virtually impossible to collide
    }
});


// ─────────────────────────────────────────────────────────────
// Step 2: Configure file validation (security filter)
// ─────────────────────────────────────────────────────────────
// WHY: Without validation, users could upload malicious files
// (executables, scripts). We restrict to image types only.

const fileFilter = (req, file, cb) => {

    // Step 2a: Define allowed image types (regex pattern)
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;

    // Step 2b: Validate file extension
    const extValid = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // → Extracts extension, lowercases it, tests against pattern
    // → 'photo.PNG' → '.PNG' → '.png' → test → true ✓

    // Step 2c: Validate MIME type (the actual content type)
    const mimeValid = allowedTypes.test(file.mimetype);
    // → file.mimetype = 'image/jpeg', 'image/png', etc.
    // → Checking MIME type is more reliable than extension alone
    //   because someone could rename a .exe to .jpg

    // Step 2d: Accept or reject
    if (extValid && mimeValid) {
        cb(null, true);    // → Both valid → accept the file
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed!'), false);
        // → Reject with descriptive error message
    }
};


// ─────────────────────────────────────────────────────────────
// Step 3: Create and export the configured Multer instance
// ─────────────────────────────────────────────────────────────

const upload = multer({
    storage,
    // → Use our disk storage config from Step 1

    fileFilter,
    // → Use our security filter from Step 2

    limits: {
        fileSize: 5 * 1024 * 1024
        // → Maximum file size: 5MB
        // → 5 × 1024 × 1024 = 5,242,880 bytes
        // → Larger files are automatically rejected by Multer
    }
});


export default upload;