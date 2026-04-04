import Router from "express";
import upload from "../../middleware/imageUpload.js";
import userController from "../../controllers/apiControllers/user.controller.js";
import adminAuth from "../../middleware/adminAuth.js";
import userAuth from "../../middleware/userAuth.js";

const userRouter = Router();

userRouter.get("/", adminAuth, userController.getAllUsers);
userRouter.post("/", userAuth, userController.createUser);
userRouter.patch("/:id", userAuth, userController.updateUser);
userRouter.delete("/:id", userAuth, userController.deleteUser);
userRouter.get("/:id", userAuth, userController.getUserById);

userRouter.post("/verify-email", userController.verifyEmail);
userRouter.post("/verify-otp", userController.verifyOtp);

export default userRouter;
