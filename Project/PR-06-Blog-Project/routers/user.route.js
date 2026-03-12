import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/dashboard',userController.userDashboard)

export default userRouter;