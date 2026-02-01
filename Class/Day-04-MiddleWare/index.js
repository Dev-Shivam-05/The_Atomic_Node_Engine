import bodyParser from "body-parser";
import express from "express";
import validation from "./middleware/validation.js";


const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", validation, (req, res) => {
  return res.render("index");
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log("App listening on port 3000!");
    console.log(`----------------------------`);
    console.log(`https://localhost:${PORT}`);
    console.log(`----------------------------`);
    return;
  }
  console.error(err);
});
