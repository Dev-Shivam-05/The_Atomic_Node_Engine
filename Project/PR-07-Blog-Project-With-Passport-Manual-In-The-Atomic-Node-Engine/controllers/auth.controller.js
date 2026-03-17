import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { validationResult } from "express-validator";

const authController = {
  // Show Registration Form
  getRegister(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    res.render("pages/register", {
      title: "Register"
    });
  },

  // Handle Registration
  async postRegister(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array()[0].msg);
      return res.redirect("/register");
    }

    try {
      const { userName, userEmail, userPassword } = req.body;

      const existingUser = await User.findOne({ $or: [{ userName }, { userEmail }] });
      if (existingUser) {
        req.flash("error", "Username or email already exists.");
        return res.redirect("/register");
      }

      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const newUser = new User({
        userName,
        userEmail,
        userPassword: hashedPassword,
        profilePic: req.file ? req.file.path : "default-profile.png"
      });

      await newUser.save();
      req.flash("success", "Registration successful. You can now login.");
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      req.flash("error", "Something went wrong during registration.");
      res.redirect("/register");
    }
  },

  // Show Login Form
  getLogin(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    res.render("pages/login", {
      title: "Login"
    });
  },

  // Handle Login
  postLogin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome back!"
    })(req, res, next);
  },

  // Handle Logout
  logout(req, res, next) {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "Logged out successfully.");
      res.redirect("/");
    });
  }
};

export default authController;
