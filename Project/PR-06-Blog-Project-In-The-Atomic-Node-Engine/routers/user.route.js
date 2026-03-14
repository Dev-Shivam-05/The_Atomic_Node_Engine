import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { checkUser } from "../middleware/authVisitor.js";

const userRouter = Router();

userRouter.get("/dashboard", checkUser, userController.userDashboard);

export default userRouter;
