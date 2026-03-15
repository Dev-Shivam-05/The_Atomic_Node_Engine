import User from "../models/user.model.js";
import cookieParser from "cookie-parser";

const browserController = {
  loginPage(req, res) {
    return res.render("index.ejs");
  },
  registerPage(req, res) {
    return res.render("pages/register.ejs");
  },
  async createUser(req, res) {
    try {
      console.log(req.body);
      let isUser = await User.findOne({userName : req.body.userName});
      if (isUser) {
        return res.redirect("/");
      } else {
        let newUser = await User.create(req.body);
        console.log(`New User is Successfully Created!! :- ${newUser}`);
        return res.redirect("/");
      }
    } catch (error) {
      console.log(error.message);
      res.status(401).send("The Error Is Here :- " + error.message);
    }
  },
  userPanel(req, res) {
    return res.render('pages/userDashboard.ejs');
  },
};

export default browserController;
