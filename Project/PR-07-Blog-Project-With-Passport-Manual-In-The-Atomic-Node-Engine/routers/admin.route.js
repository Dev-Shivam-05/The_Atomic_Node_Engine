import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { ensureAuthenticated, isAdmin } from "../middleware/auth.middleware.js";

const adminRoute = Router();

// Apply only authentication to all admin routes
adminRoute.use(ensureAuthenticated);

adminRoute.get('/dashboard', isAdmin, adminController.adminPanel);

// User Management CRUD
adminRoute.get('/users', adminController.viewUsers); // No isAdmin for viewUsers
adminRoute.get('/users/add', isAdmin, adminController.addUserPage);
adminRoute.post('/users/add', isAdmin, adminController.addUser);
adminRoute.get('/users/edit/:id', isAdmin, adminController.editUserPage);
adminRoute.post('/users/edit/:id', isAdmin, adminController.updateUser);
adminRoute.get('/users/delete/:id', adminController.deleteUser); // No isAdmin for deleteUser
adminRoute.get('/users/profile/:id', adminController.viewUserProfile); // No isAdmin for viewUserProfile

export default adminRoute;