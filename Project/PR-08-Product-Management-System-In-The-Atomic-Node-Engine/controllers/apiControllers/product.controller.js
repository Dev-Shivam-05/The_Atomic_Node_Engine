import productModel from "../../models/product.model.js";
import bcrypt from "bcrypt";
import fs from "fs";

const productController = {
  async createProduct(req, res) {
    try {
      if (req.file) {
        req.body.image = req.file.path;
      }
      const product = await productModel.create(req.body).populate('productCategory productSubcategory');
      // const product = await productModel.create(req.body);
      return res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getAllProducts(req, res) {
    try {
      const products = await productModel
        .find({})
        .populate("productCategory productSubcategory");
      return res
        .status(200)
        .json({ message: "Products fetched successfully", products });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getProductById(req, res) {
    try {
      const product = await productModel.findById(req.params.id);
      return res
        .status(200)
        .json({ message: "Product fetched successfully", product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async updateProduct(req, res) {
    try {
      if (req.file) {
        req.body.image = req.file.path;
      }
      const product = await productModel
        .findByIdAndUpdate(req.params.id, req.body, { returnDocument: "before" })
        .populate("productCategory productSubcategory");

      if (product.success && req.file) {
        const oldPath = product.Image;

        if (oldPath && fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log("Old image deleted successfully");
        }
      }
      return res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async deleteProduct(req, res) {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(
        req.params.id,
      );
      fs.unlinkSync(deletedProduct.Image);
      return res
        .status(200)
        .json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default productController;
