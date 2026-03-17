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
  },

  // Author of the blog
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Track likes and comments counts (cached for performance)
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

// Export model
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;