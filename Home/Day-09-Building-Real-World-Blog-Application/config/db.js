// ═══════════════════════════════════════════════════════════════════════
// config/db.js — DATABASE CONNECTION
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Connects our application to MongoDB using Mongoose (an ODM library).
// Mongoose provides schemas, models, validation, and query methods
// that make working with MongoDB much easier than raw MongoDB driver.
//
// HOW IT CONNECTS TO THE APP:
// server.js imports connectDB and calls it during startup.
// If connection fails, the app exits — no point running without a DB.
//
// ═══════════════════════════════════════════════════════════════════════


// Step 1: Import Mongoose
import mongoose from 'mongoose';
// → Mongoose is the bridge between Node.js and MongoDB.
//   It translates JavaScript objects into MongoDB documents and vice versa.


// Step 2: Define the connection function
const connectDB = async () => {
    try {
        // Step 3: Attempt to connect to MongoDB
        // mongoose.connect() returns a promise — we await the result.
        // The URI comes from .env: mongodb://127.0.0.1:27017/blogapp
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        // Step 4: Connection successful — log confirmation
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        // → host = server address (127.0.0.1 for local MongoDB)
        // → name = database name (blogapp)

    } catch (error) {
        // Step 5: Connection failed — log error and EXIT the application
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
        // → Exit code 1 = process ended with an error
        // → Exit code 0 = process ended normally
        // → We exit because the app cannot function without a database
    }
};


// Step 6: Export the function using ES Module syntax
// server.js imports this: import connectDB from './config/db.js';
export default connectDB;