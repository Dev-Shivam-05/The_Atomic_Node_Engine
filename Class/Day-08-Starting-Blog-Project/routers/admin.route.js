import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { checkAdmin } from "../middleware/authVisitor.js";

const adminRoute = Router();

adminRoute.get('/dashboard', checkAdmin, adminController.adminPanel);

export default adminRoute;