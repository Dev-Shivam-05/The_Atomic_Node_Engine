import mongoose from "mongoose";
import env from "./dotenv.js";

const db = async () => {
  try {
    await mongoose.connect(env.MONGO_URL);
    console.log("Connected to MongoDB");
    console.log(`Connection URL Is ${env.MONGO_URL}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default db();
