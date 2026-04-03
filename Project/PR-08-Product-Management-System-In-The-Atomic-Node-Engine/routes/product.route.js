import Router from "express";

const productRouter = Router();

productRouter.get('/create-product',(req,res)=>{
    return res.render('./pages/createProduct.ejs');
});

productRouter.get('/view-products',(req,res)=>{
    return res.render('./pages/viewProduct.ejs');
});

export default productRouter;