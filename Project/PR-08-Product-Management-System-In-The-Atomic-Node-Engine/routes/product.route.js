import Router from "express";
import productController from "../controllers/product.controller.js";
import uploadImage from "../middleware/imageUpload.js";

const productRouter = Router();

// Create a product
productRouter.get("/create-product",productController.createProductPage);
productRouter.post("/create-product",uploadImage, productController.createProduct);

// View all products
productRouter.get("/view-products",productController.viewProducts);

// Delete a product
productRouter.get("/delete-product/:id",productController.deleteProduct);

// Edit a product
productRouter.get("/edit-product/:id",productController.editProductPage);
productRouter.post("/edit-product/:id",uploadImage, productController.editProduct);

export default productRouter;