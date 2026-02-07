import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookTitle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  bookAuthor: {
    type: String,
    required: true,
    trim: true,
  },
  bookDescription: {
    type: String,
    required: true,
    trim: true,
  },
  bookPrice: {
    type: Number,
    required: true,
  },
  bookDealType: {
    type: String,
    required: true,
    trim: true,
  },
  bookImage: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;