import Router from 'express';
import apiRouter from './api/index.js';
import adminRouter from './admin.route.js';
import productRouter from './product.route.js';
import categoryRouter from './category.route.js';
import subCategoryRouter from './subCategory.route.js';
import extraCategoryRouter from './extraCategory.route.js';

const router = Router();

router.use('/api', apiRouter);
router.use('/admin',adminRouter);
router.use('/product',productRouter);
router.use('/category',categoryRouter);
router.use('/sub-category',subCategoryRouter);
router.use('/extra-category',extraCategoryRouter);

// Login
router.get('/',(req,res)=>{
    res.render('./pages/authentication-login.ejs');
});

// Register
router.get('/register',(req,res)=>{
    res.render('./pages/authentication-register.ejs');
});

export default router;