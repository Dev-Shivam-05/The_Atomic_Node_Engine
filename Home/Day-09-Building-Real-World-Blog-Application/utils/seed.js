// ═══════════════════════════════════════════════════════════════════════
// utils/seed.js — DATABASE SEEDER (Run ONCE to set up initial data)
// ═══════════════════════════════════════════════════════════════════════
//
// WHAT THIS FILE DOES:
// Creates essential initial data in the database so you can start
// using the app immediately:
//   1. An admin user account (for logging into the admin panel)
//   2. Default blog categories (Technology, Lifestyle, etc.)
//
// HOW TO RUN:
//   node utils/seed.js     (or)     npm run seed
//
// WHEN TO RUN:
//   Only ONCE, when you first set up the project.
//   Safe to re-run — it checks for existing data before inserting.
//
// ADMIN CREDENTIALS (created by this script):
//   📧 Email:    admin@blog.com
//   🔑 Password: admin123
//   ⚠️  CHANGE PASSWORD after first login in production!
//
// IMPORTANT:
//   - MongoDB must be running before you execute this script
//   - This script runs INDEPENDENTLY of server.js (it's a standalone script)
//   - It connects to MongoDB, inserts data, then disconnects and exits
//
// ═══════════════════════════════════════════════════════════════════════


// Step 1: Load environment variables
// WHY: This script runs independently (not through server.js),
// so it needs to load .env separately.
import 'dotenv/config';

// Step 2: Import required modules
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';


// Step 3: Define the seeding function
const seedDatabase = async () => {
    try {

        // ─────────────────────────────────────────────────────
        // Step 4: Connect to MongoDB
        // ─────────────────────────────────────────────────────
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding...\n');


        // ─────────────────────────────────────────────────────
        // Step 5: Create Admin User
        // ─────────────────────────────────────────────────────
        console.log('── Creating Admin User ──');

        // Check if admin already exists (prevent duplicate creation)
        const adminExists = await User.findOne({ email: 'admin@blog.com' });

        if (adminExists) {
            console.log('   ℹ️  Admin user already exists. Skipping.\n');
        } else {
            await User.create({
                name: 'Admin',
                email: 'admin@blog.com',
                password: 'admin123',
                // → The pre-save hook in User.js will automatically hash this
                // → Stored in DB as: "$2a$12$x9nM3..." (not "admin123")
                role: 'admin',
                bio: 'Site administrator and content manager.'
            });
            console.log('   ✅ Admin user created!');
            console.log('   📧 Email:    admin@blog.com');
            console.log('   🔑 Password: admin123');
            console.log('   ⚠️  Change this password in production!\n');
        }


        // ─────────────────────────────────────────────────────
        // Step 6: Create Default Categories
        // ─────────────────────────────────────────────────────
        console.log('── Creating Default Categories ──');

        const defaultCategories = [
            {
                name: 'Technology',
                icon: '💻',
                description: 'Latest tech news, tutorials, and innovations'
            },
            {
                name: 'Lifestyle',
                icon: '🌟',
                description: 'Tips and inspiration for everyday life'
            },
            {
                name: 'Business',
                icon: '💼',
                description: 'Entrepreneurship, strategy, and market insights'
            },
            {
                name: 'Health',
                icon: '💪',
                description: 'Fitness, nutrition, and wellness content'
            },
            {
                name: 'Travel',
                icon: '✈️',
                description: 'Destination guides, stories, and travel tips'
            },
            {
                name: 'Education',
                icon: '📚',
                description: 'Learning resources and educational content'
            }
        ];

        // Loop through each category and insert if not already present
        for (const catData of defaultCategories) {
            const exists = await Category.findOne({ name: catData.name });

            if (exists) {
                console.log(`   ℹ️  "${catData.name}" already exists. Skipping.`);
            } else {
                await Category.create(catData);
                // → The pre-save hook in Category.js auto-generates the slug:
                //   "Technology" → slug: "technology"
                //   "Health" → slug: "health"
                console.log(`   ✅ Category "${catData.icon}  ${catData.name}" created.`);
            }
        }


        // ─────────────────────────────────────────────────────
        // Step 7: Seeding complete — cleanup and exit
        // ─────────────────────────────────────────────────────
        console.log(`
═══════════════════════════════════════════════
🎉 Database seeding completed successfully!
═══════════════════════════════════════════════

Next steps:
  1. Start the server:  npm run dev
  2. Visit website:     http://localhost:3000
  3. Login at:          http://localhost:3000/login
  4. Admin panel:       http://localhost:3000/admin

Admin credentials:
  📧 Email:    admin@blog.com
  🔑 Password: admin123

═══════════════════════════════════════════════
        `);

        // Disconnect from MongoDB (cleanup)
        await mongoose.disconnect();

        // Exit the Node.js process
        process.exit(0);
        // → 0 = success, 1 = failure

    } catch (error) {
        console.error('\n❌ Seeding Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};


// Step 8: Execute the seeder function
seedDatabase();