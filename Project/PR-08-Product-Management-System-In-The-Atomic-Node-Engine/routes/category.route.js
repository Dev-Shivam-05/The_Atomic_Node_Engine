import Router from "express";
import categoryController from "../controllers/category.controller.js";
import uploadImage from "../middleware/imageUpload.js";

const categoryRouter = Router();

// Create a category
categoryRouter.get("/create-category",categoryController.createCategoryPage);
categoryRouter.post("/create-category",uploadImage, categoryController.createCategory);

// View all categories
categoryRouter.get("/view-categories",categoryController.viewCategories);

// Delete a category
categoryRouter.get("/deleteCategory/:id",categoryController.deleteCategory);

// Edit a category
categoryRouter.get("/editCategory/:id",categoryController.editCategoryPage);
categoryRouter.patch("/editCategory/:id", categoryController.editCategory);

export default categoryRouter;