import { Router } from "express";
import adminRoute from "./admin.route.js";
import browserRouter from "./browser.route.js";
import userRouter from "./user.route.js";
import blogRouter from "./blog.route.js";

const router = Router();

router.use("/", browserRouter);
router.use("/admin", adminRoute);
router.use("/user", userRouter);
router.use("/blog", blogRouter);

export default router;
