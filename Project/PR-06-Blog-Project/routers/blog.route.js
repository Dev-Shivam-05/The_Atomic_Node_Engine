import { Router } from "express";
import blogController from "../controllers/blog.controller.js";
import uploadImage from "../middleware/imageUpload.js";

const blogRouter = Router();

// Add Blog
blogRouter.get('/add-blog',blogController.addBlogPage);
blogRouter.post('/add-blog', uploadImage, blogController.createBlog);

// View Blog
blogRouter.get('/view-blog', blogController.viewBlogPage);

// Delete Blog
blogRouter.get('/delete/:id', uploadImage, blogController.deleteBlog);

// Edit Blog
blogRouter.get('/edit/:id', blogController.editBlogPage);
blogRouter.post('/edit/:id',uploadImage, blogController.updateBlog);

export default blogRouter;