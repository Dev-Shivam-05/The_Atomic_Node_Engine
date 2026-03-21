import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get('/', adminController.HomePage);

adminRouter.get('/add-movie',adminController.addMovie);

adminRouter.get('/view-movie',adminController.viewMovies);

export default adminRouter;