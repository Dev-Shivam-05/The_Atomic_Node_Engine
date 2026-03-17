import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  userPassword: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "default-profile.png",
  },
  bio: {
    type: String,
    trim: true,
    default: "No bio provided.",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
