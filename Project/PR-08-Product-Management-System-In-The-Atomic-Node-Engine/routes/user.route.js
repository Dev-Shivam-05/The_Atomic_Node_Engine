import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import userController from '../controllers/user.controller.js';

const userRouter = Router();

// User Panel
userRouter.get('/shop',userController.getShopData);

export default userRouter;