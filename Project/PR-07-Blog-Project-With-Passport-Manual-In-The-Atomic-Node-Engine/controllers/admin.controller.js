import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import bcrypt from "bcrypt";

const adminController = {
  async adminPanel(req, res) {
    try {
      const stats = {
        totalBlogs: await Blog.countDocuments(),
        totalUsers: await User.countDocuments(),
        totalComments: await Comment.countDocuments(),
      };

      const recentBlogs = await Blog.find()
        .populate("author", "userName")
        .sort({ createdAt: -1 })
        .limit(5);

      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5);

      res.render("pages/adminDashboard.ejs", {
        stats,
        recentBlogs,
        recentUsers,
        title: "Admin Dashboard"
      });
    } catch (error) {
      console.error(error);
      res.redirect("/");
    }
  },

  // View All Users
  async viewUsers(req, res) {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.render("pages/admin/users-list", {
        users,
        title: "User Management"
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Could not fetch users.");
      res.redirect("/admin/dashboard");
    }
  },

  // Add User Page
  addUserPage(req, res) {
    res.render("pages/admin/user-form", {
      title: "Add New User",
      userToEdit: null
    });
  },

  // Create User
  async addUser(req, res) {
    try {
      const { userName, userEmail, userPassword, role } = req.body;
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      
      await User.create({
        userName,
        userEmail,
        userPassword: hashedPassword,
        role: role || "user"
      });

      req.flash("success", "User created successfully!");
      res.redirect("/admin/users");
    } catch (error) {
      console.error(error);
      req.flash("error", "Failed to create user.");
      res.redirect("/admin/users/add");
    }
  },

  // Edit User Page
  async editUserPage(req, res) {
    try {
      const userToEdit = await User.findById(req.params.id);
      if (!userToEdit) return res.redirect("/admin/users");
      
      res.render("pages/admin/user-form", {
        title: "Edit User",
        userToEdit
      });
    } catch (error) {
      res.redirect("/admin/users");
    }
  },

  // Update User
  async updateUser(req, res) {
    try {
      const { userName, userEmail, role } = req.body;
      await User.findByIdAndUpdate(req.params.id, {
        userName,
        userEmail,
        role
      });
      req.flash("success", "User updated successfully!");
      res.redirect("/admin/users");
    } catch (error) {
      req.flash("error", "Update failed.");
      res.redirect("/admin/users");
    }
  },

  // Delete User
  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      // Erase profile picture from disk
      if (user.profilePic && user.profilePic !== "default-profile.png" && fs.existsSync(user.profilePic)) {
        fs.unlinkSync(user.profilePic);
      }
      
      await User.findByIdAndDelete(req.params.id);
      req.flash("success", "User and their profile image deleted.");
      res.redirect("/admin/users");
    } catch (error) {
      res.redirect("/admin/users");
    }
  },

  // View Detailed Profile
  async viewUserProfile(req, res) {
    try {
      const userProfile = await User.findById(req.params.id);
      const userBlogs = await Blog.find({ author: req.params.id });
      
      res.render("pages/admin/user-profile", {
        userProfile,
        userBlogs,
        title: "User Profile"
      });
    } catch (error) {
      res.redirect("/admin/users");
    }
  }
};

export default adminController;