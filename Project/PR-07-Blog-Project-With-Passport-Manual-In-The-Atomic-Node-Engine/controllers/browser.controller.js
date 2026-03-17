import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

const browserController = {
  async homePage(req, res) {
    try {
      const latestBlogs = await Blog.find()
        .populate("author", "userName profilePic")
        .sort({ createdAt: -1 })
        .limit(6);
      
      const stats = {
        totalBlogs: await Blog.countDocuments(),
        totalUsers: await User.countDocuments(),
        // Add more stats if needed
      };

      res.render("index.ejs", {
        latestBlogs,
        stats,
        title: "Welcome to Blog Engine"
      });
    } catch (error) {
      console.error(error);
      res.render("index.ejs", { latestBlogs: [], stats: { totalBlogs: 0, totalUsers: 0 } });
    }
  }
};

export default browserController;
