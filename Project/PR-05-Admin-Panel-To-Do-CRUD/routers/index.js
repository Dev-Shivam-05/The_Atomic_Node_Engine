import { Router } from "express";
import adminRouter from "./admin.route.js";
import movieRouter from "./movie.route.js";
import homeRouter from "./home.route.js";

const router = Router();

router.use('/', homeRouter);
router.use('/admin', adminRouter);
router.use('/movie', movieRouter);

export default router;  
