import mongoose from "mongoose";
import envConfig from "./dotenv.js";

const db = async () => {
    try {
        await mongoose.connect(envConfig.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default db();