import Router from 'express';
import subcategoryController from '../../controllers/apiControllers/sub.category.controller.js';
import upload from '../../middleware/imageUpload.js';
import uploadImage from '../../middleware/imageUpload.js';

const subcategoryRouter = Router();

// Get all subcategories
subcategoryRouter.get('/', subcategoryController.getAllSubcategories);

// Create a new subcategory
subcategoryRouter.post('/', subcategoryController.createSubCategory);

// Update a subcategory
subcategoryRouter.patch('/:id', subcategoryController.updateSubcategory);

// Delete a subcategory
subcategoryRouter.delete('/:id', subcategoryController.deleteSubcategory);

// Get a subcategory by ID
subcategoryRouter.get('/:id', subcategoryController.getSubcategoryById);

// Get subcategories by category ID
subcategoryRouter.get('/get-by-category/:categoryId', subcategoryController.getByCategory);

export default subcategoryRouter;