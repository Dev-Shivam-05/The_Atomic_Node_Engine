const subCategoryController = {
  createSubCategory: async (req, res) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/category/create-category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Category 1",
          }),
        },
      );
      console.log(response);
      
      const data = await response.json();
      console.log(data);
      
      return res.redirect(data.success ? "/category/view-categories" : "/");
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
      const response = await fetch(
        "http://localhost:3000/api/category/view-categories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      return res.render("./pages/viewSubCategory.ejs", {
        subCategories: data.data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
    return res.render("./pages/viewSubCategory.ejs");
  },
};

export default subCategoryController;
