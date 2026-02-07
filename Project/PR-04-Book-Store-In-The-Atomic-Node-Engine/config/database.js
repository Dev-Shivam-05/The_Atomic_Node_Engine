import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

const database = mongoose.connection;

// Connection successful
database.on('connected', () => {
    console.log(`✅ Database Successfully Connected At ${mongoURI}`);
});

// Connection error
database.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('⚠️ Make sure MongoDB is running!');
});

// Connection disconnected
database.on('disconnected', () => {
    console.warn('⚠️ Database Disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
    await database.close();
    console.log('Database connection closed');
    process.exit(0);
});

export default database;
