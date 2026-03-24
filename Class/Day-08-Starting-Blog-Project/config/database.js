import mongoose from "mongoose";
import envConfig from "./dotenv.js";

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Mongo DB database Is Successfully Connected!!!`);
        console.log(process.env.MONGODB_URL);
    } catch (error) {
        console.log(error.message);
    }
}

export default db();