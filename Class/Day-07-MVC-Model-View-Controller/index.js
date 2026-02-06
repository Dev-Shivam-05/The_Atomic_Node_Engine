import express from "express";
import db from "./configs/database.js";
import router from "./router/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.get("/", (req, res) => {
    return res.render("index", { title: "Home Page" })
});

app.listen(port, () => {
    console.log(`app listening on port ${port}! http://localhost:${port}`);
});