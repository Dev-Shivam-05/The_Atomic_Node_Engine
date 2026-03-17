import Blog from "../models/blog.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
import fs from "fs";

const blogController = {
  addBlogPage(req, res) {
    return res.render("./pages/add-blog.ejs");
  },

  async createBlog(req, res) {
    try {
      if (!req.file) {
        req.flash("error", "Image required.");
        return res.redirect("/blog/add-blog");
      }

      const blogData = {
        ...req.body,
        blogImage: req.file.path,
        author: req.user._id || req.user.id
      };

      await Blog.create(blogData);
      req.flash("success", "Blog posted!");
      return res.redirect("/");
    } catch (error) {
      req.flash("error", "Error creating post.");
      return res.redirect("/blog/add-blog");
    }
  },

  async viewBlogPage(req, res) {
    try {
      const blogs = await Blog.find().populate("author").sort({ createdAt: -1 });
      return res.render("./pages/view-blog.ejs", { blogs });
    } catch (error) {
      return res.redirect("/");
    }
  },

  async getBlogDetails(req, res) {
    try {
      const blog = await Blog.findById(req.params.id).populate("author");
      const comments = await Comment.find({ blog: req.params.id }).populate("user");
      const userHasLiked = req.user ? await Like.exists({ blog: req.params.id, user: req.user._id || req.user.id }) : false;

      res.render("pages/blog-details", { blog, comments, userHasLiked });
    } catch (error) {
      res.redirect("/");
    }
  },

  async likeBlog(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const blogId = req.params.id;

      // Ensure consistent ID for hardcoded admin
      const finalUserId = userId === "hardcoded_admin_id" ? userId : userId.toString();

      const existingLike = await Like.findOne({ blog: blogId, user: userId });
      if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: -1 } }, { new: true });
        return res.json({ success: true, liked: false, likeCount: updatedBlog.likeCount });
      } else {
        await Like.create({ blog: blogId, user: userId });
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: 1 } }, { new: true });
        return res.json({ success: true, liked: true, likeCount: updatedBlog.likeCount });
      }
    } catch (error) {
      console.error("Like Error:", error);
      res.status(500).json({ success: false });
    }
  },

  async commentBlog(req, res) {
    try {
      const { commentContent } = req.body;
      const userId = req.user._id || req.user.id;

      await Comment.create({
        commentContent,
        blog: req.params.id,
        user: userId
      });

      await Blog.findByIdAndUpdate(req.params.id, { $inc: { commentCount: 1 } });
      res.redirect(`/blog/details/${req.params.id}`);
    } catch (error) {
      res.redirect(`/blog/details/${req.params.id}`);
    }
  },

  async deleteBlog(req, res) {
    try {
      const blog = await Blog.findById(req.params.id);
      
      // Physically delete the image file from disk (Cleanup)
      if (blog.blogImage && fs.existsSync(blog.blogImage)) {
        fs.unlinkSync(blog.blogImage);
      }

      // Full delete capability: Any authenticated user can delete
      await Blog.findByIdAndDelete(req.params.id);
      await Like.deleteMany({ blog: req.params.id });
      await Comment.deleteMany({ blog: req.params.id });

      req.flash("success", "Blog and its image deleted.");
      res.redirect("/user/dashboard");
    } catch (error) {
      res.redirect("/");
    }
  },

  async editBlogPage(req, res) {
    try {
      const blog = await Blog.findById(req.params.id);
      res.render("pages/edit-blog", { blog });
    } catch (error) {
      res.redirect("/");
    }
  },

  async updateBlog(req, res) {
    try {
      const blog = await Blog.findById(req.params.id);
      const updateData = { ...req.body };

      if (req.file) {
        // Erase old image if new one is uploaded
        if (blog.blogImage && fs.existsSync(blog.blogImage)) {
          fs.unlinkSync(blog.blogImage);
        }
        updateData.blogImage = req.file.path;
      }

      await Blog.findByIdAndUpdate(req.params.id, updateData);
      res.redirect("/user/dashboard");
    } catch (error) {
      res.redirect("/");
    }
  },
};

export default blogController;
