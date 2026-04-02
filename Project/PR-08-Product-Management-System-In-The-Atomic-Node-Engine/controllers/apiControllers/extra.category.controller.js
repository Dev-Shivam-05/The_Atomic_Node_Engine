import fs from "fs";
import extraCategoryModel from "../../models/extra.category.model.js";

const extraCategoryController = {
  async createExtraCategory(req, res) {
    try {
      // console.log(`Request Body :- ${req.body}`);
      // console.log(`Request FIle :- ${req.file}`);
      // const { extraCategoryName, Image, subCategoryId } = req.body;
      console.log("Body:", req.body);
      console.log("File:", req.file);

      if (req.file) {
        req.body.Image = req.file.path;
      }
      const extraCategory = await extraCategoryModel.create(req.body);
      return res.status(201).json({
        message: "ExtraCategory created successfully",
        extraCategory,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getExtraCategories(req, res) {
    try {
      const extraCategories = await extraCategoryModel
        .find({})
        .populate("subCategoryId");
      return res.status(200).json({
        message: "ExtraCategories fetched successfully",
        extraCategories,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getExtraCategoryById(req, res) {
    try {
      const extraCategory = await extraCategoryModel
        .findById(req.params.id)
        .populate("subCategoryId");
      return res.status(200).json({
        message: "ExtraCategory fetched successfully",
        extraCategory,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async updateExtraCategory(req, res) {
    try {
      console.log("============ Update ExtraCategory =============");
      const { extraCategoryName } = req.body;

      // Validation
      if (
        extraCategoryName &&
        (typeof extraCategoryName !== "string" ||
          extraCategoryName.trim().length < 3)
      ) {
        return res.status(400).json({
          error: "ExtraCategory name must be at least 3 characters long.",
        });
      }

      const extraCategory = await extraCategoryModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          ...(extraCategoryName
            ? { extraCategoryName: extraCategoryName.trim() }
            : {}),
        },
        { returnDocument: "before" },
      );
      if (!extraCategory) {
        return res.status(404).json({ error: "ExtraCategory not found." });
      }
      console.log(extraCategory);
      if (extraCategory.success && req.file) {
        const oldPath = extraCategory.Image;
        if (oldPath && fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log("Old image deleted successfully");
        }
      }

      return res.status(200).json({
        message: "ExtraCategory updated successfully",
        extraCategory: extraCategory,
        Request: req.body,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async deleteExtraCategory(req, res) {
    try {
      const extraCategory = await extraCategoryModel.findById(req.params.id);
      if (!extraCategory) {
        return res.status(404).json({ error: "ExtraCategory not found." });
      }
      if (extraCategory.success && extraCategory.Image) {
        const oldPath = extraCategory.Image;
        if (oldPath && fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log("Old image deleted successfully");
        }
      }
      await extraCategoryModel.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ message: "ExtraCategory deleted successfully", success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getBySubCategory(req, res) {
    try {
      const { categoryId } = req.params;
      console.log("categoryId:", categoryId);
      const extraCategories = await extraCategoryModel.find({
        categoryId: categoryId,
      });

      console.log("extraCategories:", extraCategories);

      return res.status(200).json({
        success: true,
        extraCategories: extraCategories,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default extraCategoryController;
