import Router from "express";

const extraCategoryRouter = Router();

extraCategoryRouter.get('/create-extraCategory',(req,res)=>{
    return res.render('./pages/createExtraCategory.ejs');
});

extraCategoryRouter.get('/view-extraCategories',(req,res)=>{
    return res.render('./pages/viewExtraCategory.ejs');
});

export default extraCategoryRouter;