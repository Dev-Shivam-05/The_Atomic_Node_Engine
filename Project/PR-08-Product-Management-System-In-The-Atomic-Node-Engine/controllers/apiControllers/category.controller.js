import categoryModel from "../../models/category.model.js";
import bcrypt from "bcrypt";

const categoryController = {
  async createCategory(req, res) {
    try {
      const category = await categoryModel.create(req.body);
      return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getAllCategories(req, res) {
    try {
      const categories = await categoryModel.find({});
      return res
        .status(200)
        .json({ message: "Categories fetched successfully", categories });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getCategoryById(req, res) {
    try {
      const category = await categoryModel.findById(req.params.id);
      return res
        .status(200)
        .json({ message: "Category fetched successfully", category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async updateCategory(req, res) {
    try {
      console.log('============ Update Category =============');
      const category = await categoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      return res
        .status(200)
        .json({ message: "Category updated successfully", category , Request: req.body});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async deleteCategory(req, res) {
    try {
      await categoryModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default categoryController;