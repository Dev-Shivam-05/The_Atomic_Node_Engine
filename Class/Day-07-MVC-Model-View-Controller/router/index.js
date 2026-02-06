import { Router } from "express";
const router = Router();
import adminRouter from "./admin.route.js";

router.use("/admin", adminRouter);
export default router;