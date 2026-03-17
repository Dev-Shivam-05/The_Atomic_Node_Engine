import Blog from "../models/blog.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";

import User from "../models/user.model.js";
import fs from "fs";

const userController = {
  async userDashboard(req, res) {
    try {
      const userId = req.user._id;

      // Get user's own blogs
      const userBlogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

      // Get blogs the user has liked
      const likedBlogs = await Like.find({ user: userId }).populate({
        path: "blog",
        populate: { path: "author", select: "userName" }
      });

      // Get user's comments
      const userComments = await Comment.find({ user: userId }).populate("blog", "blogTitle");

      res.render("pages/userDashboard.ejs", {
        userBlogs,
        likedBlogs,
        userComments,
        title: "My Dashboard"
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Error loading dashboard.");
      res.redirect("/");
    }
  },

  // Update Profile Info
  async updateProfile(req, res) {
    try {
      const { userName, bio } = req.body;
      const updateData = { userName, bio };

      if (req.file) {
        // Delete old pic if not default
        if (req.user.profilePic && req.user.profilePic !== "default-profile.png") {
          const oldPath = req.user.profilePic;
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        updateData.profilePic = req.file.path;
      }

      await User.findByIdAndUpdate(req.user.id, updateData);
      req.flash("success", "Profile updated successfully!");
      res.redirect("/user/dashboard");
    } catch (error) {
      console.error(error);
      req.flash("error", "Profile update failed.");
      res.redirect("/user/dashboard");
    }
  }
};

export default userController;
