import Router from 'express';
import categoryController from '../../controllers/apiControllers/category.controller.js';
import upload from '../../middleware/imageUpload.js';
import uploadImage from '../../middleware/imageUpload.js';

const categoryRouter = Router();

categoryRouter.get('/', categoryController.getAllCategories);
categoryRouter.post('/', categoryController.createCategory);
categoryRouter.patch('/:id', categoryController.updateCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);
categoryRouter.get('/:id', categoryController.getCategoryById);

export default categoryRouter;