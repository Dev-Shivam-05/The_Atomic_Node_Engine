import express, { request } from "express";

const app = express();
const PORT = 3000;

let todos = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.render("index", { todos });
});

app.post("/addTaskToList", (req, res) => {
  let todo = {
    taskId: Date.now(),
    text: req.body.text,
  };

  todos.push(todo);
  return res.redirect(req.get("Referer") || "/");
});

app.get("/deleteTask", (req, res) => {
  const { taskId } = req.query;
  todos = todos.filter((item) => item.taskId != taskId);
  res.redirect("/");
});

app.get("/editTask/:id", (req, res) => {
  let { taskId } = req.params;
  console.log(taskId);

  let todo = todos.find((todo) => todo.taskId == taskId);
  return res.render("edit.ejs", { todo });
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`App listening on port ${PORT}!`);
    console.log(`http://localhost:${PORT}/`);
  } else {
    console.log(err);
  }
});
