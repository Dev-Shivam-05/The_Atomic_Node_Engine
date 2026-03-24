import dotenv from "dotenv";
dotenv.config();

const envConfig = {
    PORT : process.env.PORT,
    MONGODB_URL: process.env.PORT
}

export default envConfig;