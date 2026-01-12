import express, { request } from "express";

const app = express();
const PORT = 3000;

let todos = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { todos });
});

app.post("/", (req, res) => {
  const { taskId } = req.body;

  if (taskId) {
    todos = todos.map((todo) => {
      if (todo.taskId == taskId) {
        return req.body;
      }
      return todo;
    });
    return res.redirect("/");
  } else {
    todos.push({ ...req.body, taskId: Date.now() });
    return res.redirect(req.get("Referrer") || "/");
  }
});

app.get("/delete/task/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((task) => task.taskId != id);
  console.log(req.params.taskId);

  return res.redirect(req.get("Referrer") || "/");
});

app.get("/edit/task/:id", (req, res) => {
  const { id } = req.params;
  let todo = todos.find((item) => item.taskId == id);

  return res.render("Edit-Task", { todo });
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`App listening on port ${PORT}!`);
    console.log(`http://localhost:${PORT}/`);
  } else {
    console.log(err);
  }
});
