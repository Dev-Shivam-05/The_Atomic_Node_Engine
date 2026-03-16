// ═══════════════════════════════════════════════════════════════════════
// models/User.js — USER DATABASE MODEL
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Defines the "blueprint" (schema) for User documents in MongoDB.
// Every user account — whether regular user or admin — is stored
// as a document following this schema in the 'users' collection.
//
// FIELDS:
//   name     → Display name
//   email    → Login email (unique, case-insensitive)
//   password → Hashed password (NEVER stored as plain text)
//   role     → 'user' or 'admin' (controls access permissions)
//   avatar   → Profile picture filename
//   bio      → Short biography text
//
// SECURITY FEATURE — Automatic Password Hashing:
// Before any User document is saved to the database, the pre('save')
// hook automatically hashes the password using bcrypt. This means:
//   Input:  password = "admin123"
//   Stored: password = "$2a$12$x9nM3Xk..." (60-char hash)
//   → Even if the database is breached, real passwords are protected
//
// HOW IT CONNECTS:
//   config/passport.js → finds users during login
//   controllers/client/authController.js → creates users during registration
//   controllers/admin/dashboardController.js → counts users for stats
//   models/Blog.js → references User as the blog author
//
// ═══════════════════════════════════════════════════════════════════════


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


// ─────────────────────────────────────────────────────────────
// Step 1: Define the User Schema
// ─────────────────────────────────────────────────────────────
// A schema defines: what fields exist, their data types,
// validation rules, and default values.

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            // → [validationRule, errorMessage]
            // → If name is missing, Mongoose throws this error
            trim: true
            // → Removes whitespace from both ends: "  John  " → "John"
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            // → Creates a unique index in MongoDB
            // → Attempting to create two users with the same email
            //   will throw a duplicate key error
            lowercase: true,
            // → Auto-converts to lowercase before saving
            // → "Admin@Blog.COM" → "admin@blog.com"
            trim: true
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters']
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            // → Only these two values are allowed
            // → Mongoose rejects anything else (e.g., 'superadmin')
            default: 'user'
            // → New accounts are 'user' by default
            // → Admin role is set manually (via seed script or DB edit)
        },

        avatar: {
            type: String,
            default: 'default-avatar.png'
            // → Default profile picture if none uploaded
        },

        bio: {
            type: String,
            default: '',
            maxlength: [500, 'Bio cannot exceed 500 characters']
        }
    },
    {
        timestamps: true
        // → Mongoose auto-adds:
        //   createdAt: Date when document was first saved
        //   updatedAt: Date when document was last modified
    }
);


// ─────────────────────────────────────────────────────────────
// Step 2: Pre-save Hook — Automatically hash password
// ─────────────────────────────────────────────────────────────
// WHEN: Runs automatically BEFORE every .save() or User.create() call.
// WHAT: Encrypts the password field using bcrypt.
// WHY:  NEVER store plain-text passwords. If the database is hacked,
//       bcrypt hashes cannot be reversed to reveal the original password.
//
// IMPORTANT: We use a regular function (not arrow function) because
// arrow functions don't have their own `this` — and we need `this`
// to refer to the document being saved.

userSchema.pre('save', async function (next) {

    // Step 2a: Only hash if the password field was actually changed
    if (!this.isModified('password')) {
        return next();
        // → Maybe only the user's name was updated
        // → No need to re-hash the already-hashed password
        // → Without this check, we'd hash the hash (double-hashing = bad)
    }

    // Step 2b: Generate a salt (random data mixed into the hash)
    const salt = await bcrypt.genSalt(12);
    // → Salt = random string that makes each hash unique
    // → Two users with password "abc123" get DIFFERENT hashes
    // → 12 = number of salt rounds (higher = more secure but slower)
    // → 12 rounds ≈ ~300ms to hash (good balance of security and speed)

    // Step 2c: Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    // → Replaces plain text with hash:
    //   "admin123" → "$2a$12$x9nM3XkR.../..."
    // → The hash is 60 characters long and contains:
    //   $2a = bcrypt algorithm version
    //   $12 = cost factor (rounds)
    //   ... = salt + hash combined

    // Step 2d: Continue to save the document
    next();
});


// ─────────────────────────────────────────────────────────────
// Step 3: Instance Method — Compare candidate password with hash
// ─────────────────────────────────────────────────────────────
// WHAT: A method available on every User document instance.
// USAGE: const isMatch = await user.comparePassword('abc123');
// WHY:  Provides a clean API for password verification.
//       Used in config/passport.js during login.

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
    // → bcrypt.compare hashes candidatePassword with the same salt
    //   and compares the result with the stored hash
    // → Returns true if match, false if not
};


// ─────────────────────────────────────────────────────────────
// Step 4: Create and export the Model
// ─────────────────────────────────────────────────────────────
// A Model is a wrapper around the schema that provides:
//   User.create(), User.find(), User.findById(),
//   User.findOne(), User.updateOne(), User.deleteOne(), etc.

const User = mongoose.model('User', userSchema);
// → First arg 'User' = model name
// → MongoDB auto-creates collection 'users' (lowercase + pluralized)

export default User;