import env from 'dotenv';

env.config();

const envConfig = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    USER_KEY: process.env.USER_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
}

export default envConfig;