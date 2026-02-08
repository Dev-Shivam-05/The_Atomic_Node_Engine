import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URI,
};
