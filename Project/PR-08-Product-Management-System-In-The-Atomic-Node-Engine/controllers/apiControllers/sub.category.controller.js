import subcategoryModel from "../../models/subcategory.model.js";

const subcategoryController = {
  async createSubCategory(req, res) {
    try {
      if (req.file) {
        req.body.image = req.file.path;
      }
      const subcategory = await subcategoryModel.create(req.body);
      return res
        .status(201)
        .json({ message: "Subcategory created successfully", subcategory });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getAllSubcategories(req, res) {
    try {
      const subcategories = await subcategoryModel.find({});
      return res
        .status(200)
        .json({ message: "Subcategories fetched successfully", subcategories });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getSubcategoryById(req, res) {
    try {
      const subcategory = await subcategoryModel.findById(req.params.id);
      return res
        .status(200)
        .json({ message: "Subcategory fetched successfully", subcategory });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async updateSubcategory(req, res) {
    try {
      if (req.file) {
        req.body.image = req.file.path;
      }
      const subcategory = await subcategoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: "after" },
      );
      return res
        .status(200)
        .json({ message: "Subcategory updated successfully", subcategory });
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
        .json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default subcategoryController;
