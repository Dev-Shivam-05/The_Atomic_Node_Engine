import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  // Blog Title
  blogTitle: {
    type: String,
    required: true
  },

  // Featured Image (path or URL)
  blogImage: {
    type: String,
    required: true
  },

  // Category
  blogCategory: {
    type: String,
    required: true
  },

  // Tags (comma-separated string — process later if needed)
  blogTags: {
    type: String
  },

  // Short preview/excerpt
  blogExcerpt: {
    type: String,
    required: true
  },

  // Full blog content
  blogContent: {
    type: String,
    required: true
  }

}, {
  timestamps: true // Adds createdAt and updatedAt — harmless, useful
});

// Export model
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;