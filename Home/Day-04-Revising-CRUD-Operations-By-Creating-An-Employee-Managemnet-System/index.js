import express from "express";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;

let employees = [];

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  let emp = req.body;

  employees.push({ ...emp, employeeID: generateEmployeeID(emp) });
  console.log(employees);
  return res.redirect(req.get("Referrer") || "/");
});

const generateEmployeeID = (emp_data) => {
  const name = emp_data.employeeName;
  const designation = emp_data.designation;
  const salary = emp_data.employeeSalary;
  let i = 0;
  while (i < name.length && name[i] !== " ") i++;
  const firstName = name.slice(0, i).toUpperCase();
  const desig = designation.slice(0, 3).toUpperCase();
  const salaryPart = salary.slice(0, 3);
  return `${firstName}${desig}${salaryPart}`;
};

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`------------------------------`);
  console.log(`http://localhost:${PORT}`);
  console.log(`------------------------------`);
});
