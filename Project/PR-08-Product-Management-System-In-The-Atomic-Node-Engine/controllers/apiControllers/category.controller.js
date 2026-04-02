import categoryModel from "../../models/category.model.js";
import bcrypt from "bcrypt";

const categoryController = {
  async createCategory(req, res) {
    try {
      const { categoryName, categoryDescription } = req.body;

      // Validation
      if (!categoryName || typeof categoryName !== 'string' || categoryName.trim().length < 3) {
        return res.status(400).json({ error: "Category name must be at least 3 characters long." });
      }
      if (!categoryDescription || typeof categoryDescription !== 'string' || categoryDescription.trim().length < 10) {
        return res.status(400).json({ error: "Category description must be at least 10 characters long." });
      }

      // Check if category already exists (business rule)
      const existingCategory = await categoryModel.findOne({ categoryName: categoryName.trim() });
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists." });
      }

      const category = await categoryModel.create({
        ...req.body,
        categoryName: categoryName.trim(),
        categoryDescription: categoryDescription.trim()
      });
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
      const { categoryName, categoryDescription } = req.body;

      // Validation
      if (categoryName && (typeof categoryName !== 'string' || categoryName.trim().length < 3)) {
        return res.status(400).json({ error: "Category name must be at least 3 characters long." });
      }
      if (categoryDescription && (typeof categoryDescription !== 'string' || categoryDescription.trim().length < 10)) {
        return res.status(400).json({ error: "Category description must be at least 10 characters long." });
      }

      // Check if another category with the same name already exists
      if (categoryName) {
        const existingCategory = await categoryModel.findOne({ 
          categoryName: categoryName.trim(), 
          _id: { $ne: req.params.id } 
        });
        if (existingCategory) {
          return res.status(400).json({ error: "Another category with this name already exists." });
        }
      }

      const category = await categoryModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          ...(categoryName ? { categoryName: categoryName.trim() } : {}),
          ...(categoryDescription ? { categoryDescription: categoryDescription.trim() } : {})
        },
        { new: true },
      );
      if (!category) {
        return res.status(404).json({ error: "Category not found." });
      }
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