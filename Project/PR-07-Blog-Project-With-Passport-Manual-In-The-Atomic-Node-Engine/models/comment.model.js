import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentContent: {
    type: String,
    required: true,
    trim: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true,
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
