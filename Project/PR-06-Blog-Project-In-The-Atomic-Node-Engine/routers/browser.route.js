import { Router } from "express"; // ✅ FIXED: Named import
import browserController from "../controllers/browser.controller.js";
import {
  authVisitor,
  checkAdmin,
  checkRole,
  checkUser,
} from "../middleware/authVisitor.js";

const browserRouter = Router();

// Login Page
browserRouter.get("/", checkRole, browserController.loginPage);

// Register Page
browserRouter.get("/user/register", browserController.registerPage);

// Creating User Process
browserRouter.post("/create/user", browserController.createUser);

// Verifying Visitor
browserRouter.post("/auth/visitor", authVisitor);

// Logout route
browserRouter.get("/logout", (req, res) => {
  res.clearCookie("userId");
  res.clearCookie("userRole");
  res.redirect("/");
});

export default browserRouter;