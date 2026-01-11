import express from "express";

const app = express();
const PORT = 3000;

let todos = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res)