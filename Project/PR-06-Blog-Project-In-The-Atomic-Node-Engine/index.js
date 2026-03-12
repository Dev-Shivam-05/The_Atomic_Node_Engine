import express from "express";
import router from "./routers/index.js";
import db from "./config/database.js";
import envConfig from "./config/dotenv.js";
import morgan from "morgan";
import User from "./models/user.model.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const port = envConfig.PORT || 3000;

app.set("views", "./views");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(morgan("dev"));

app.use(cookieParser());
app.use(router);

app.listen(port, (err) => {
  if (!err) {
    console.log("App listening on port ", port + "!");
    console.log(`http://localhost/${port}/`);
  } else {
    console.log(err.message);
  }
});
