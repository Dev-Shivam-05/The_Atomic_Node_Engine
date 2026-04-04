import fs from "fs";

const categoryController = {
  createCategoryPage: (req, res) => {
    return res.render("./pages/createCategory.ejs");
  },
  createCategory: async (req, res) => {
    try {
      // console.log(req.file);
      req.body.Image = req.file ? req.file.path : "";
      // console.log("Request Body :- ",req.body);
      const response = await fetch("https://product-management-system-q0bp.onrender.com/api/category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      // console.log("Response :- ",response);
      const data = await response.json();
      // console.log("Response Data :- ",data);
      return res.redirect(req.get("Referrer") || "/");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  viewCategories: async (req, res) => {
    try {
      const response = await fetch("https://product-management-system-q0bp.onrender.com/api/category/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("Response :- ", response);
      const responseToJson = await response.json();
      // console.log("Response responseToJson :- ", responseToJson);
      return res.render("./pages/viewCategory.ejs", {
        categories:
          responseToJson.categories == [] ? [] : responseToJson.categories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
    return res.render("./pages/viewCategory.ejs");
  },
  deleteCategory: async (req, res) => {
    try {
      const response = await fetch(
        `https://product-management-system-q0bp.onrender.com/api/category/${req.params.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // console.log("Response :- ", response);
      const responseToJson = await response.json();
      // console.log("Response responseToJson :- ", responseToJson);
      return res.redirect(req.get("Referrer") || "/");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  editCategoryPage: async (req, res) => {
    try {
      const response = await fetch(
        `https://product-management-system-q0bp.onrender.com/api/category/${req.params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // console.log("Response :- ", response);
      const responseToJson = await response.json();
      // console.log("Response responseToJson :- ", responseToJson);
      return res.render("./pages/editCategory.ejs", {
        category: responseToJson.category,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  editCategory: async (req, res) => {
    try {
      // console.log(`File :- ${req.file}`);
      
      console.log('============ Edit Category Starts =============');
      req.body.Image = req.file ? req.file.path : "";
      console.log("Request Body :- ",req.body);
      const response = await fetch(
        `https://product-management-system-q0bp.onrender.com/api/category/${req.params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        },
      );
      console.log("Response :- ",response);
      const data = await response.json();
      console.log("Response Data :- ",data.category);
      if(req.file){
        fs.unlinkSync(data.category.Image);
      }
      console.log("Response Data :- ",data);
      console.log('============ Edit Category Ends =============');
      return res.redirect("/category/view-categories");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default categoryController;