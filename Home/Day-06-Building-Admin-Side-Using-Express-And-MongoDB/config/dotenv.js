import dotenv from 'dotenv';
dotenv.config();

const env = {
    PORT : process.env.PORT,
    MONGO_URL : process.env.MONGO_URL
}

export default env;