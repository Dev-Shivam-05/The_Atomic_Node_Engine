import express from "express";
import env from "./config/dotenv.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

const port = process.env.PORT;

app.use(
  session({
    secret: "Practicing Sessions For MongoDB",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.get("/", (req, res) => {
  const authorData = req.session.author;
  if (authorData) {
    res.send(
      `${authorData.authorName} Is Author And He Is ${authorData.authorAge} Year Old His Hobby is ${authorData.authorChoice}!!`,
    );
  } else {
    res.send(
      "There Is No Author If YOu Want To Create AUtor Then Go To /create-session Route.....",
    );
  }
});

app.get("/get-session", (req, res) => {
  const authorData = req.session.author;
  if (authorData) {
    res.json(authorData);
  } else {
    res.send(
      "There Is No Author If You Want To Create AUtor Then Go To /create-session Route.....",
    );
  }
});

app.get("/create-session", (req, res) => {
  req.session.author = {
    authorName: "Shivam Bhadoriya",
    authorAge: 19,
    authorCity: "Vijalpure Navsari",
    authorChoice: "Coding",
  };

  if (req.session.author) {
    res.send("Session Author Is Successfully Created.....");
  } else {
    res.send("Something Went Wrong For Creating The Sessions");
  }
});

app.get("/destroy-session", (req, res) => {
  if (req.session.author) {
    const deleteAuthor = req.session.author;

    req.session.destroy((err) => {
      if (err) {
        res.send(err.message);
      } else {
        res.send(
          `Author is Successfullly Deleted From The DataBase.....`,
        );
      }
    });
  } else {
    res.send("Something Went Wrong For Destroying The Sessions");
  }
});

app.listen(port, (err) => {
  if (!err) {
    console.log("App listening on port " + port);
    console.log(`http://localhost:${port}/`);
  } else {
    console.log(err.message);
  }
});
