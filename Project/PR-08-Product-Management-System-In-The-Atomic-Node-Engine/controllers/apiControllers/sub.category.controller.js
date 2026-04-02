import fs from "fs";
import subcategoryModel from "../../models/subcategory.model.js";

const subcategoryController = {
  async createSubCategory(req, res) {
    try {
      console.log(req.body);
      const { subcategoryName, Image, categoryId } = req.body;
      if (req.file) {
        req.body.Image = req.file.path;
      }
      const subcategory = await subcategoryModel.create(req.body);
      return res.status(201).json({
        message: "Subcategory created successfully",
        subcategory,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getAllSubcategories(req, res) {
    try {
      const subcategories = await subcategoryModel
        .find({})
        .populate("categoryId");
      return res.status(200).json({
        message: "Subcategories fetched successfully",
        subcategories,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getSubcategoryById(req, res) {
    try {
      const subcategory = await subcategoryModel.findById(req.params.id);
      return res.status(200).json({
        message: "Subcategory fetched successfully",
        subcategory,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async updateSubcategory(req, res) {
    try {
      console.log("============ Update Category =============");
      const { subcategoryName } = req.body;

      // Validation
      if (
        subcategoryName &&
        (typeof subcategoryName !== "string" ||
          subcategoryName.trim().length < 3)
      ) {
        return res.status(400).json({
          error: "Subcategory name must be at least 3 characters long.",
        });
      }

      const subcategory = await subcategoryModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          ...(subcategoryName
            ? { subcategoryName: subcategoryName.trim() }
            : {}),
        },
        { returnDocument: "before" },
      );
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found." });
      }
      console.log(subcategory);
      if (subcategory.success && req.file) {
        const oldPath = subcategory.Image;

        if (oldPath && fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log("Old image deleted successfully");
        }
      }

      return res.status(200).json({
        message: "Subcategory updated successfully",
        subcategory: subcategory,
        Request: req.body,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async deleteSubcategory(req, res) {
    try {
      await subcategoryModel.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ message: "Subcategory deleted successfully", success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      console.log('categoryId:', categoryId);
      const subcategories = await subcategoryModel.find({ categoryId: categoryId });
      
      console.log('subcategories:', subcategories);
      
      return res.status(200).json({
        success: true,
        subcategories: subcategories,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default subcategoryController;
