import Router from 'express';
import productController from '../../controllers/apiControllers/product.controller.js';
import upload from '../../middleware/imageUpload.js';

const productRouter = Router();

productRouter.get('/', productController.getAllProducts);
productRouter.post('/', upload, productController.createProduct);
productRouter.patch('/:id', upload, productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);
productRouter.get('/:id', productController.getProductById);

export default productRouter;