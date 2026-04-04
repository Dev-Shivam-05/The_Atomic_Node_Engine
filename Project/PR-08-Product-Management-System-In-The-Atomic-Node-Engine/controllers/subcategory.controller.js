import fs from "fs";
import categoryModel from "../models/category.model.js";

const subCategoryController = {
  createSubCategoryPage: async (req, res) => {
    const categories = await categoryModel.find();
    console.log(categories);
    return res.render("./pages/createSubCategory.ejs", { categories });
  },
  createSubCategory: async (req, res) => {
    try {
      console.log();
      console.log("============ CreateSubCategory Start ============");

      console.log(req.body);
      req.body.Image = req.file.path;
      const response = await fetch("https://product-management-system-q0bp.onrender.com/api/sub-category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      console.log(response);

      const data = await response.json();
      console.log(data);

      console.log("============ CreateSubCategory End ============");
      console.log();

      return res.redirect(
        data.success
          ? "/sub-category/view-sub-categories"
          : "/sub-category/create-sub-category",
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  viewSubCategories: async (req, res) => {
    try {
      console.log();
      console.log("============ ViewSubCategories Start ============");
      const response = await fetch("https://product-management-system-q0bp.onrender.com/api/sub-category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseToJson = await response.json();
      console.log(responseToJson);

      // const category = await categoryModel.find();
      // console.log(categories);
      console.log("============ ViewSubCategories End ============");
      console.log();

      return res.render("./pages/viewSubCategories.ejs", {
        subCategories: responseToJson.subcategories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  deleteSubCategory: async (req, res) => {
    try {
      console.log();
      console.log("============ DeleteSubCategory Start ============");
      const response = await fetch(
        "https://product-management-system-q0bp.onrender.com/api/sub-category/" + req.params.id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: req.params.id,
          }),
        },
      );
      const responseToJson = await response.json();
      console.log(responseToJson);

      console.log("============ DeleteSubCategory End ============");
      console.log();

      return res.redirect(req.get("referer") || "/sub-category/view-sub-categories");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  editSubCategoryPage: async (req, res) => {
    console.log();
    console.log("============ EditSubCategoryPage Start ============");
    console.log(req.params.id);
    const subcategory = await fetch(
      "https://product-management-system-q0bp.onrender.com/api/sub-category/" + req.params.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const category = await fetch(
      "https://product-management-system-q0bp.onrender.com/api/category/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const subcategoryToJson = await subcategory.json();
    const categoryToJson = await category.json();
    console.log(subcategoryToJson);
    console.log("============ EditSubCategoryPage End ============");
    console.log();

    return res.render("../views/pages/editSubCategory.ejs", {
      subCategory: subcategoryToJson.subcategory,
      categories: categoryToJson.categories,
    });
  },
  editSubCategory: async (req, res) => {
    try {
      console.log();
      console.log("============ EditSubCategory Start ============");
      req.body.Image = req.file ? req.file.path : req.body.Image || '';
      console.log(req.body);
      const response = await fetch(
        "https://product-management-system-q0bp.onrender.com/api/sub-category/" + req.params.id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        },
      );
      const responseToJson = await response.json();
      
      console.log( "Edit SubCategory Response: " + responseToJson.success + " " + responseToJson.message + " " + responseToJson);

      console.log("============ EditSubCategory End ============");
      console.log();

      return res.redirect("/sub-category/view-sub-categories");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default subCategoryController;
