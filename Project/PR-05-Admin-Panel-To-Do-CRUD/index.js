import express from "express";
import router from "./routers/index.js";
import morgan from "morgan";
import db from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

app.set("views", "./views");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(morgan("dev"));

app.use(cookieParser());
app.use(router);

app.listen(port, (err) => {
  if (!err) {
    console.log("App listening on port 3000!");
    console.log(`http://localhost:${port}/`);
  } else {
    console.log(err);
  }
});
