import express from "express";
import bodyParser from "body-parser";
import env from "./config/dotenv.js";
import database from "./config/database.js";
import generateUserID from "./assets/js/generateUserId.js";
import User from "./models/User.js";

const app = express();
const port = process.env.PORT || 3000;
const users = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  // Create the object using the data from the form
  const userData = {
    userID: generateUserID(),
    userName: req.body.userName,
    userPassword: req.body.userPassword,
  };

  try {
    await User.create(userData);

    console.log("Successfully saved user to MongoDB:", userData);
    res.redirect(res.get("Referrer") || "/");
  } catch (err) {
    console.log("Error saving to database:", err);
    res.status(500).send("Error saving data");
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("App listening on port " + port + "!");
    console.log(`http://localhost:${port}/`);
  }
});
