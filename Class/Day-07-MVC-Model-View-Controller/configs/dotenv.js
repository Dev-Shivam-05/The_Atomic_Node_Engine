import dotenv from 'dotenv';
dotenv.config();

const envConfig = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI
};

export default envConfig;