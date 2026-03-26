import env from "dotenv";

env.config();

const envConfig = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
};

export default envConfig;