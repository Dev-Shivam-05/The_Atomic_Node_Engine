import Router from 'express';
import extraCategoryController from '../../controllers/apiControllers/extra.category.controller.js';
import uploadImage from '../../middleware/imageUpload.js';

const extraCategoryRouter = Router();

// Get all extra categories
extraCategoryRouter.get('/', extraCategoryController.getExtraCategories);

// Create a new extra category
extraCategoryRouter.post('/', uploadImage, extraCategoryController.createExtraCategory);

// Update a extra category
extraCategoryRouter.patch('/:id', uploadImage, extraCategoryController.updateExtraCategory);

// Delete a extra category
extraCategoryRouter.delete('/:id', extraCategoryController.deleteExtraCategory);

// Get a extra category by ID
extraCategoryRouter.get('/:id', extraCategoryController.getExtraCategoryById);

// Get extra categories by category ID
extraCategoryRouter.get('/get-by-sub-category/:subcategoryId', extraCategoryController.getBySubCategory);

export default extraCategoryRouter;