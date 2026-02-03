import express from "express";
import bodyParser from "body-parser";
import env from "./config/dotenv.js";
import database from "./config/database.js";
import generateUserID from "./assets/js/generateUserId.js";
import User from "./models/UserTbl.js";
import UserModel from "./models/UserTbl.js";

const app = express();
const port = process.env.PORT || 3000;
const users = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.render("index.ejs");
});

app.post("/", (req, res) => {
  if (req.body._id) {
    UserModel.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((data) => {
        res.redirect("/view-user");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  } else {
    UserModel.create(req.body)
      .then((data) => {
        res.redirect(req.get("Referrer") || "/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect(req.get("Referrer") || "/");
      });
  }
});

app.get("/view-user", (req, res) => {
  UserModel.find({})
    .then((user) => {
      return res.render("./pages/view-user.ejs", { user });
    })
    .catch((err) => {
      console.log(err);
      return res.render("./pages/view-user.ejs", { user });
    });
});

app.get("/delete/user/:userId", (req, res) => {
  UserModel.findByIdAndDelete(req.params.userId)
    .then(() => {
      res.redirect(req.get("Referrer") || "/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect(req.get("Referrer") || "/");
    });
});

app.get("/edit/user/:userId", (req, res) => {
  let id = req.params.userId;
  UserModel.findById(id)
    .then((user) => {
      console.log(user);
      return res.render("./pages/edit-user.ejs", { user });
    })
    .catch((err) => {
      console.log(err);
      return res.render("./pages/edit-user.ejs");
    });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("App listening on port " + port + "!");
    console.log(`http://localhost:${port}/`);
  }
});
