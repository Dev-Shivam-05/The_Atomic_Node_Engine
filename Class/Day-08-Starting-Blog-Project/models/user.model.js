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
  }
});

const User = mongoose.model("User", userSchema);

export default User;
