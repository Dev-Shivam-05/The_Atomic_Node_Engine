import Router from 'express';
import userRouter from './user.route.js';
import productRouter from './product.route.js';
import categoryRouter from './category.route.js';
import subcategoryRouter from './sub.category.route.js';
import extraCategoryRouter from './extra.category.route.js';

const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/product', productRouter);
apiRouter.use('/category', categoryRouter);
apiRouter.use('/sub-category', subcategoryRouter);
apiRouter.use('/extra-category', extraCategoryRouter);

export default apiRouter;