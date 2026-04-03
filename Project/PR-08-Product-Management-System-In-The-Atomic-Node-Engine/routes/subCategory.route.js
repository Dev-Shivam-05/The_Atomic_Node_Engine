import Router from "express";
import subCategoryController from "../controllers/subcategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.get('/create-sub-category',(req,res)=>{
    return res.render('./pages/createSubCategory.ejs');
});

subCategoryRouter.get('/view-sub-categories',(req,res)=>{
    return res.render('./pages/viewSubCategory.ejs');
});

// Create a category
// subCategoryRouter.get("/create-category",subCategoryController.createSubCategory);

// View all categories
// subCategoryRouter.get("/view-categories",subCategoryController.viewSubCategories);


export default subCategoryRouter;