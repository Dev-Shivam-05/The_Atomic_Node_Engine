import express from "express";
import mongoose from "mongoose";
import imageUpload from "./middleware/imageUpload.js";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import database from "./config/database.js";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  Book.find({})
    .then((books) => {
      return res.render("index.ejs", { books });
    })
    .catch((error) => {
      console.error("❌ Error fetching books:", error.message);
      return res.render("index.ejs", { books: [] });
    });
});
  
// ============================================
// Adding BOOK ROUTE
// ============================================
app.post("/", imageUpload, (req, res) => {
  if (req.file) {
    req.body.bookImage = req.file.path;
  }
  console.log("📚 Book Data Received:", req.body);
  console.log("📷 File Info:", req.file);

  Book.create(req.body)
    .then((book) => {
      console.log("✅ Book created:", book);
      return res.status(201).json({ success: true, message: "Book added successfully", book });
    })
    .catch((error) => {
      console.error("❌ Error creating book:", error.message);
      return res.status(500).json({ success: false, message: "Error creating book: " + error.message });
    });
});

// ============================================
// Loading View BOOK ROUTE
// ============================================
app.get("/view-books", (req, res) => {
  Book.find({})
    .then((books) => {
      return res.render("pages/view-books.ejs", { books });
    })
    .catch((error) => {
      console.error("❌ Error fetching books:", error.message);
      return res.status(500).send("Error fetching books: " + error.message);
    });
});

// ============================================
// Loading Add BOOK's ROUTE
// ============================================
app.get("/add-book", (req, res) => {
  return res.render("pages/add-book.ejs");
});

// ============================================
// DELETE BOOK ROUTE
// ============================================
app.get("/delete/user/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then((book) => {
      console.log("✅ Book deleted:", book.bookTitle);
      fs.unlink(book.bookImage, (err) => {
        if (err) {
          console.warn("⚠️ Warning: Could not delete image file:", err.message);
        }
      });
      return res.redirect("/view-books");
    })
    .catch((error) => {
      console.error("❌ Error deleting book:", error.message);
      return res.status(500).json({ success: false, message: "Error deleting book: " + error.message });
    });
});

// ============================================
// Edit BOOK ROUTE
// ============================================
app.get("/edit/user/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      console.log("✅ Book found:", book.bookTitle);
      return res.render("pages/edit-book.ejs", { book });
    })
    .catch((error) => {
      console.error("❌ Error finding book:", error.message);
      return res.status(500).send("Error finding book: " + error.message);
    });
});

// ============================================
// UPDATE BOOK ROUTE
// ============================================
app.post("/update-book/:id", imageUpload, (req, res) => {
  if (req.file) {
    req.body.bookImage = req.file.path;
  }
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((book) => {
      console.log(book);
      if (req.file) {
        fs.unlink(book.bookImage, (err) => {
          if (err) {
            console.warn("⚠️ Warning: Could not delete image file:", err.message);
          }
        });
      }
      console.log("✅ Book updated:", book.bookTitle);
      return res.redirect("/view-books");
    })
    .catch((error) => {
      console.error("❌ Error updating book:", error.message);
      return res.status(500).json({ success: false, message: "Error updating book: " + error.message });
    });
});

// ============================================
// Starting Server ROUTE
// ============================================
app.listen(port, "0.0.0.0", (err) => {
  if (!err) {
    console.log("App listening on port 3000!");
    console.log(`http://localhost:${port}`);
    return;
  }
  console.log(err);
});
