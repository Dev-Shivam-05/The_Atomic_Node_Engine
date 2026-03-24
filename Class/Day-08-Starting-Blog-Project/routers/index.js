import { Router } from "express";
import adminRoute from "./admin.route.js";
import browserRouter from "./browser.route.js";
import userRouter from "./user.route.js";

const router = Router();

router.use("/", browserRouter);
router.use("/admin", adminRoute);
router.use("/user", userRouter);

export default router;
