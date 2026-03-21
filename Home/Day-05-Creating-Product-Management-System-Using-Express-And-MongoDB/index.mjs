import express from "express";

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(3000, () => console.log(` app listening on port port! 3000 /n http://localhost:port`));