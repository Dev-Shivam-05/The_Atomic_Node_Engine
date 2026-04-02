import Router from 'express';
import upload from '../../middleware/imageUpload.js';
import userController from '../../controllers/apicontrollers/user.controller.js';

const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.post('/',  userController.createUser);
userRouter.patch('/:id',  userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);
userRouter.get('/:id', userController.getUserById);

userRouter.post('/verify-email', userController.verifyEmail);
userRouter.post('/verify-otp', userController.verifyOtp);

export default userRouter;
