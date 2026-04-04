const productController = {
  createProductPage: async (req, res) => {
    console.log();
    console.log(`============ Create Product Page Starts ============ `);
    const categories = await fetch("https://product-management-system-q0bp.onrender.com/api/category/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const subcategories = await fetch(
      "https://product-management-system-q0bp.onrender.com/api/sub-category",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const extraCategories = await fetch(
      "https://product-management-system-q0bp.onrender.com/api/extra-category",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const categoriesData = await categories.json();
    const subcategoriesData = await subcategories.json();
    const extraCategoriesData = await extraCategories.json();
    console.log(categoriesData);
    console.log(subcategoriesData);
    console.log(`============ Create Product Page Ends ============ `);
    return res.render("./pages/createProduct.ejs", {
      categories: categoriesData.categories,
      subcategories: subcategoriesData.subcategories,
      extraCategories: extraCategoriesData.extraCategories,
    });
  },
  createProduct: async (req, res) => {
    console.log();
    console.log(`============ Create Product Starts ============ `);
    req.body.Image = req.file ? req.file.path : "";
    console.log("Request Body: ", req.body);
    const response = await fetch("https://product-management-system-q0bp.onrender.com/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    console.log(data);
    console.log(`============ Create Product Ends ============ `);
    return res.redirect("/product/view-products");
  },
  viewProducts: async (req, res) => {
    console.log();
    console.log(`============ View Products Starts ============ `);
    const response = await fetch("https://product-management-system-q0bp.onrender.com/api/product/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    console.log(`============ View Products Ends ============ `);
    return res.render("./pages/viewProduct.ejs", {
      products: data.products,
    });
  },
  deleteProduct: async (req, res) => {
    console.log();
    console.log(`============ Delete Product Starts ============ `);
    const response = await fetch(
      `https://product-management-system-q0bp.onrender.com/api/product/${req.params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    console.log(data);
    console.log(`============ Delete Product Ends ============ `);
    return res.redirect("/product/view-products");
  },
  editProductPage: async (req, res) => {
    console.log();
    console.log(`============ Edit Product Page Starts ============ `);
    const responseProduct = await fetch(
      `https://product-management-system-q0bp.onrender.com/api/product/${req.params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responseCategory = await fetch(
      "https://product-management-system-q0bp.onrender.com/api/category/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const Product = await responseProduct.json();
    const categories = await responseCategory.json();
    console.log(Product);
    console.log(`============ Edit Product Page Ends ============ `);
    return res.render("./pages/editProduct.ejs", {
      product: Product.product,
      categories: categories.categories,
    });
  },
  editProduct: async (req, res) => {
    console.log();
    console.log(`============ Edit Product Starts ============ `);
    req.body.Image = req.file ? req.file.path : "";
    console.log("Request Body: ", req.body);
    const response = await fetch(
      `https://product-management-system-q0bp.onrender.com/api/product/${req.params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );
    const data = await response.json();
    console.log(data);
    console.log(`============ Edit Product Ends ============ `);
    return res.redirect("/product/view-products");
  },
}

export default productController;