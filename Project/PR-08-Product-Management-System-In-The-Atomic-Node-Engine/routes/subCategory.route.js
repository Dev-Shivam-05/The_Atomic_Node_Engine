import Router from "express";
import subCategoryController from "../controllers/subcategory.controller.js";
import uploadImage from "../middleware/imageUpload.js";

const subCategoryRouter = Router();

// Create a category
subCategoryRouter.get("/create-sub-category",subCategoryController.createSubCategoryPage);
subCategoryRouter.post("/create-sub-category",uploadImage, subCategoryController.createSubCategory);

// View all categories
subCategoryRouter.get("/view-sub-categories",subCategoryController.viewSubCategories);

// Delete a category
subCategoryRouter.get("/delete-sub-category/:id",subCategoryController.deleteSubCategory);

// Edit a category
subCategoryRouter.get("/edit-sub-category/:id",subCategoryController.editSubCategoryPage);
subCategoryRouter.post("/edit-sub-category/:id",uploadImage, subCategoryController.editSubCategory);

export default subCategoryRouter;