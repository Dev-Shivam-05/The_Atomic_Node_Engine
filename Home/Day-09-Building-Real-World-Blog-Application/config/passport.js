// ═══════════════════════════════════════════════════════════════════════
// config/passport.js — PASSPORT AUTHENTICATION STRATEGY
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Configures HOW Passport.js verifies users when they log in.
// We use the "Local Strategy" — email + password stored in our database.
// (As opposed to OAuth strategies like Google/Facebook login.)
//
// THE COMPLETE LOGIN FLOW:
// ┌────────────────────────────────────────────────────────────┐
// │ 1. User submits login form → POST /login                  │
// │ 2. authController calls passport.authenticate('local')    │
// │ 3. Passport triggers the LocalStrategy defined HERE       │
// │ 4. We query the database for the email                    │
// │ 5. We compare the submitted password with the stored hash │
// │ 6. If match → done(null, user) → Passport serializes user│
// │ 7. If no match → done(null, false, { message }) → flash  │
// │ 8. serializeUser saves user.id into the session           │
// │ 9. On subsequent requests, deserializeUser loads the user │
// │    from DB using the stored ID, attaching it to req.user  │
// └────────────────────────────────────────────────────────────┘
//
// HOW IT CONNECTS:
// server.js calls: configurePassport(passport)
// authController.js calls: passport.authenticate('local')
//
// ═══════════════════════════════════════════════════════════════════════


// Step 1: Import required packages (ES Module syntax)
import passportLocal from 'passport-local';
// → passport-local provides the LocalStrategy class.
//   ES Modules import the default export, which is an object
//   containing the Strategy constructor.

import bcrypt from 'bcryptjs';
// → bcrypt securely compares passwords without decrypting.
//   It hashes the candidate password and compares the result
//   with the stored hash.

import User from '../models/User.js';
// → Our User model — used to query the database.
// → NOTE: In ES Modules, you MUST include the .js extension!


// Step 2: Extract the Strategy constructor from the default export
const LocalStrategy = passportLocal.Strategy;
// → In CommonJS: const LocalStrategy = require('passport-local').Strategy;
// → In ES Modules: We import the default, then access .Strategy on it.


// Step 3: Export the configuration function
// WHY a function? Because server.js passes its Passport instance to us,
// and we configure strategies + serialization on that instance.

const configurePassport = (passport) => {

    // ─────────────────────────────────────────────────────────
    // Step 4: Define the Local Strategy
    // ─────────────────────────────────────────────────────────
    // This tells Passport: "When someone tries to log in using
    // passport.authenticate('local'), run this function."

    passport.use(
        new LocalStrategy(
            {
                // Step 4a: Map form fields to strategy parameters
                // By default, Passport expects 'username'. Our form uses 'email'.
                usernameField: 'email',     // → reads req.body.email
                passwordField: 'password'   // → reads req.body.password (default)
            },

            // Step 4b: The verification callback
            // Runs every time someone submits the login form.
            //   email    → from the form
            //   password → from the form (plain text)
            //   done     → callback to tell Passport the result
            async (email, password, done) => {
                try {
                    // Step 5: Search for user by email in the database
                    const user = await User.findOne({ email: email.toLowerCase() });
                    // → .toLowerCase() ensures case-insensitive matching
                    // → "Admin@Blog.com" matches "admin@blog.com" in the DB

                    // Step 6: If no user found with this email
                    if (!user) {
                        return done(null, false, {
                            message: 'This email is not registered. Please sign up first.'
                        });
                        // → done(error, user, info)
                        // → null  = no system error occurred
                        // → false = authentication failed (no user)
                        // → { message } = flash message shown to the user
                    }

                    // Step 7: User found — now compare passwords
                    const isMatch = await bcrypt.compare(password, user.password);
                    // → bcrypt.compare takes the plain-text password and the hash
                    // → It hashes the plain password with the same salt
                    // → Then compares the two hashes
                    // → Returns true if they match, false if they don't
                    // → IMPORTANT: We never "decrypt" the hash — comparison is one-way

                    // Step 8: If passwords don't match
                    if (!isMatch) {
                        return done(null, false, {
                            message: 'Incorrect password. Please try again.'
                        });
                    }

                    // Step 9: Both email and password are correct!
                    return done(null, user);
                    // → done(null, user) = "Authentication successful!"
                    // → Passport now calls serializeUser (below) with this user

                } catch (error) {
                    // Step 10: Handle unexpected errors (DB down, network issues)
                    return done(error);
                    // → Passport will forward this to Express error handler
                }
            }
        )
    );


    // ─────────────────────────────────────────────────────────
    // Step 11: serializeUser — Save user ID into the session
    // ─────────────────────────────────────────────────────────
    // WHEN:  Runs ONCE, immediately after successful authentication.
    // WHAT:  Decides what data to store in the session.
    // WHY:   We store ONLY the user's ID (not the full object) to keep
    //        sessions small and efficient. The full user is loaded later.
    //
    // ANALOGY: Like getting a concert wristband with your ticket number.
    //          The wristband stores your number, not your entire profile.

    passport.serializeUser((user, done) => {
        done(null, user.id);
        // → user.id = Mongoose shorthand for user._id.toString()
        // → This ID is stored in the session cookie
        // → The session now knows: "Session abc123 belongs to user xyz789"
    });


    // ─────────────────────────────────────────────────────────
    // Step 12: deserializeUser — Load full user from session ID
    // ─────────────────────────────────────────────────────────
    // WHEN:  Runs on EVERY request from a logged-in user.
    // WHAT:  Takes the user ID stored in the session and queries
    //        the database to get the complete user document.
    // WHY:   So that req.user contains full user data (name, email,
    //        role, avatar, etc.) that controllers and views can use.
    //
    // ANALOGY: Showing your wristband at the VIP entrance — security
    //          looks up your ticket number to get your full info.

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            // → Queries MongoDB: db.users.findOne({ _id: id })
            // → Returns the complete user document or null

            done(null, user);
            // → Attaches user to req.user for this request
            // → Now controllers can access req.user.name, req.user.role, etc.
            // → Views can access currentUser (set by flashMiddleware)

        } catch (error) {
            done(error);
        }
    });
};

export default configurePassport;