import mongoose from 'mongoose';
import envConfig from './dotenv.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(envConfig.MONGODB_URL);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB();