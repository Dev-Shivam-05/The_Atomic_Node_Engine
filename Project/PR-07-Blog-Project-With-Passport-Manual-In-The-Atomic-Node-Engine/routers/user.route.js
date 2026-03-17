import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import { uploadProfilePic, resizeProfilePic } from "../middleware/imageUpload.js";

const userRouter = Router();

userRouter.get('/dashboard', ensureAuthenticated, userController.userDashboard);
userRouter.post('/profile/update', ensureAuthenticated, uploadProfilePic, resizeProfilePic, userController.updateProfile);

export default userRouter;
