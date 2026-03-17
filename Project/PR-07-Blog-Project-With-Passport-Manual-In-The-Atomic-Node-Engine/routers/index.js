import { Router } from "express";
import adminRoute from "./admin.route.js";
import browserRouter from "./browser.route.js";
import userRouter from "./user.route.js";
import blogRouter from "./blog.route.js";
import authRouter from "./auth.route.js";

const router = Router();

router.use("/", browserRouter);
router.use("/", authRouter); // Auth routes (register, login, logout)
router.use("/admin", adminRoute);
router.use("/user", userRouter);
router.use("/blog", blogRouter);

export default router;
