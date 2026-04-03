import Router from "express";

const adminRouter = Router();

adminRouter.get('/',(req,res)=>{
    res.render('./pages/admin-panel.ejs');
});

export default adminRouter;