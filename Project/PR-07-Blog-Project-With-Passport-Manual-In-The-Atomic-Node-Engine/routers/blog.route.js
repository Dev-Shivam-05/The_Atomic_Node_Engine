import { Router } from "express";
import blogController from "../controllers/blog.controller.js";
import { uploadBlogImage } from "../middleware/imageUpload.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";

const blogRouter = Router();

// Public Blog View
blogRouter.get('/view-blog', blogController.viewBlogPage);
blogRouter.get('/details/:id', blogController.getBlogDetails);

// Protected Blog Actions
blogRouter.get('/add-blog', ensureAuthenticated, blogController.addBlogPage);
blogRouter.post('/add-blog', ensureAuthenticated, uploadBlogImage, blogController.createBlog);

blogRouter.get('/delete/:id', ensureAuthenticated, blogController.deleteBlog);

blogRouter.get('/edit/:id', ensureAuthenticated, blogController.editBlogPage);
blogRouter.post('/edit/:id', ensureAuthenticated, uploadBlogImage, blogController.updateBlog);

// Likes and Comments
blogRouter.post('/like/:id', ensureAuthenticated, blogController.likeBlog);
blogRouter.post('/comment/:id', ensureAuthenticated, blogController.commentBlog);

export default blogRouter;