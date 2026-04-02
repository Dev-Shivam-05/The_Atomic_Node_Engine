import Router from "express";
import extraCategoryController from "../controllers/extracategory.controller.js";
import uploadImage from "../middleware/imageUpload.js";

const extraCategoryRouter = Router();

// Create a category
extraCategoryRouter.get("/create-extra-category",extraCategoryController.createExtraCategoryPage);
extraCategoryRouter.post("/create-extra-category",uploadImage, extraCategoryController.createExtraCategory);        

// View all categories
extraCategoryRouter.get("/view-extra-categories",extraCategoryController.viewExtraCategories);

// Delete a category
extraCategoryRouter.get("/delete-extra-category/:id",extraCategoryController.deleteExtraCategory);

// Edit a category
extraCategoryRouter.get("/edit-extra-category/:id",extraCategoryController.editExtraCategoryPage);
extraCategoryRouter.post("/edit-extra-category/:id",uploadImage, extraCategoryController.editExtraCategory);

export default extraCategoryRouter; 
