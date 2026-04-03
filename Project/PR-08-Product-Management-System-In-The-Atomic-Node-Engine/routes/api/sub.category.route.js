import Router from 'express';
import subcategoryController from '../../controllers/apiControllers/sub.category.controller.js';
import upload from '../../middleware/imageUpload.js';

const subcategoryRouter = Router();

subcategoryRouter.get('/', subcategoryController.getAllSubcategories);
subcategoryRouter.post('/', upload, subcategoryController.createSubCategory);
subcategoryRouter.patch('/:id', upload, subcategoryController.updateSubcategory);
subcategoryRouter.delete('/:id', subcategoryController.deleteSubcategory);
subcategoryRouter.get('/:id', subcategoryController.getSubcategoryById);

export default subcategoryRouter;