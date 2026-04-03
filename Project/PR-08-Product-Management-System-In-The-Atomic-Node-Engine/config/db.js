import mongoose from 'mongoose';
import envConfig from './dotenv.js';

const db = async () => {
    try {
        await mongoose.connect(envConfig.MONGODB_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

export default db();