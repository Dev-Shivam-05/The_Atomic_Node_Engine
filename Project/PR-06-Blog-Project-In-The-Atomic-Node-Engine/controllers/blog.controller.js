import Blog from "../models/blog.model.js";
import fs from "fs";

const blogController = {
  addBlogPage(req, res) {
    return res.render("./pages/add-blog.ejs");
  },

  async createBlog(req, res) {
    try {
      // 1. CHECK: Did they actually upload a file?
      if (!req.file) {
        // If no file, go back and tell them (optional, but good UX)
        return res.redirect(
          req.get("Referrer") + "?error=Please upload an image",
        );
      }

      // 2. LOG: Use a COMMA, not a plus sign
      console.log("Body Data:", req.body);
      console.log("File Data:", req.file);

      // 3. PREPARE DATA: Don't change req.body directly. Create a new object.
      const blogData = {
        ...req.body, // Copy all text fields (title, desc)
        blogImage: req.file.path, // Add the image path
      };

      // 4. SAVE
      let newBlog = await Blog.create(blogData);
      console.log("Blog Created:", newBlog);

      // 5. REDIRECT
      return res.redirect(req.get("Referrer") || "/");
    } catch (error) {
      console.log("ERROR SAVING BLOG:", error.message);
      return res.redirect(req.get("Referrer") || "/");
    }
  },

  async viewBlogPage(req, res) {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return res.render("./pages/view-blog.ejs", { blogs });
    } catch (error) {
      console.log(error);
      return res.redirect("/");
    }
  },
  async deleteBlog(req, res) {
    try {
      console.log(req.params);
      const { id } = req.params;
      const user = await Blog.findByIdAndDelete(id);
      fs.unlinkSync(user.blogImage, (err) => {
        if (err) {
          console.log("Error in deleting image: " + err.message);
        } else {
          console.log("Image Is Successfully Deleted...");
        }
      });
      res.redirect(req.get("Referrer" || "/"));
    } catch (error) {
      console.log(error);
    }
  },
  // ── Render Edit Page ──
  async editBlogPage(req, res) {
    try {
      let { id } = req.params;
      let blog = await Blog.findById(id);

      if (!blog) {
        return res.redirect("/blog");
      }

      res.render("pages/edit-blog", { blog });
    } catch (error) {
      console.log(error.message);
      res.redirect("/blog");
    }
  },

  // ── Handle Update ──
  async updateBlog(req, res) {
    try {
      let { id } = req.params;

      if (req.file) {
        req.body.blogImage = req.file.path;
      }

      await Blog.findByIdAndUpdate(id, req.body);
      res.redirect("/blog/view-blog");
    } catch (error) {
      console.log(error.message);
      res.redirect(req.get('referrer') || "/");
    }
  },
};

export default blogController;
