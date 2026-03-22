import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL
}

export default env;