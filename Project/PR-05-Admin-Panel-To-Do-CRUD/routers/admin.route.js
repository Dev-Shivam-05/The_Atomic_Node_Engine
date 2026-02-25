import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { auth, adminAuth } from "../middleware/authentication.js"; 

const adminRouter = Router();

adminRouter.get('/', auth, adminAuth, adminController.AdminPage);
adminRouter.get("/add-movie", auth, adminAuth, adminController.addMovie);
adminRouter.get("/view-movie", auth, adminAuth, adminController.viewMovies);

export default adminRouter;