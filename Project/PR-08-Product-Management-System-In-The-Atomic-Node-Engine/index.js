import express from "express";

import envConfig from "./config/dotenv.js";
import db from "./config/db.js";
import router from "./routes/index.js";
import authMiddleware from "./middleware/auth.js";

const port = envConfig.PORT;
const app = express();

app.use(express.json()); 
// app.use(authMiddleware);
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));
app.use(router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`http://localhost:${port}`);
});