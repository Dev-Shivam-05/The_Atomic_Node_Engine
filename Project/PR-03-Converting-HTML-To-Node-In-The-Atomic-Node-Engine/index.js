import express from "express";
import bodyParser from "body-parser";
import env from "env";

const app = express();
const port = env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get('/analytics',(req,res)=>{
  res.render('./pages/analytics.ejs');
})

app.get('/auth-login-minimal',(req,res) => {
  res.render('./pages/auth-login-minimal.ejs');
})

app.get('/auth-register-minimal',(req,res) => {
  res.render('./pages/auth-register-minimal.ejs');
})

app.listen(port, (err) => {
  if (!err) {
    console.log(`app listening on port port! ${port}`);
    console.log(`http://localhost:${port}`);
  } else {
    console.log(err);
  }
});