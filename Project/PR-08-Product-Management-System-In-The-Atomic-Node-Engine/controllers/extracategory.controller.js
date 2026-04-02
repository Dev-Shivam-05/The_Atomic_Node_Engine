import fs from "fs";
import categoryModel from "../models/category.model.js";

const extraCategoryController = {
  createExtraCategoryPage: async (req, res) => {
    const subCategories = await fetch("http://localhost:8081/api/sub-category");
    const subCategoriesToJson = await subCategories.json();
    console.log(subCategoriesToJson);
    return res.render("./pages/createExtraCategory.ejs", { extraCategories: subCategoriesToJson.subcategories });
  },
  createExtraCategory: async (req, res) => {
    try {
      console.log();
      console.log("============ CreateExtraCategory Start ============");

      console.log(req.body);
      req.body.Image = req.file.path;
      const response = await fetch("http://localhost:8081/api/extra-category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      console.log(response);

      const data = await response.json();
      console.log(data);

      console.log("============ CreateExtraCategory End ============");
      console.log();

      return res.redirect(
        data.success
          ? "/extra-category/view-extra-categories"
          : "/extra-category/create-extra-category",
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  viewExtraCategories: async (req, res) => {
    try {
      console.log();
      console.log("============ ViewExtraCategories Start ============");
      const response = await fetch("http://localhost:8081/api/extra-category/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseToJson = await response.json();
      console.log(responseToJson);

      // const category = await categoryModel.find();
      // console.log(categories);
      console.log("============ ViewExtraCategories End ============");
      console.log();

      return res.render("./pages/viewExtraCategories.ejs", {    
        extraCategories: responseToJson.extraCategories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  deleteExtraCategory: async (req, res) => {
    try {
      console.log();
      console.log("============ DeleteExtraCategory Start ============");
      const response = await fetch(
        "http://localhost:8081/api/extra-category/" + req.params.id,
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

      console.log("============ DeleteExtraCategory End ============");
      console.log();

      return res.redirect(req.get("referrer") || "/extra-category/view-extra-categories");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  editExtraCategoryPage: async (req, res) => {
    console.log();
    console.log("============ EditExtraCategoryPage Start ============");
    console.log(req.params.id);
    const extraCategory = await fetch(
      "http://localhost:8081/api/extra-category/" + req.params.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const extraCategoryToJson = await extraCategory.json();
    const subCategory = await fetch(
      "http://localhost:8081/api/sub-category/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const subCategoryToJson = await subCategory.json();
    console.log(extraCategoryToJson);
    console.log(subCategoryToJson);
    console.log("============ EditExtraCategoryPage End ============");
    console.log();

    return res.render("./pages/editExtraCategory.ejs", {
      extraCategory: extraCategoryToJson.extraCategory,
      subCategories: subCategoryToJson.subcategories,
    });
  },
  editExtraCategory: async (req, res) => {
    try {
      console.log();
      console.log("============ EditExtraCategory Start ============");
      req.body.Image = req.file ? req.file.path : req.body.Image || '';
      console.log(req.body);
      const response = await fetch(
        "http://localhost:8081/api/extra-category/" + req.params.id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        },
      );
      const responseToJson = await response.json();
      
      console.log( "Edit ExtraCategory Response: " + responseToJson.success + " " + responseToJson.message + " " + responseToJson);

      console.log("============ EditExtraCategory End ============");
      console.log();

      return res.redirect("/extra-category/view-extra-categories");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default extraCategoryController;
