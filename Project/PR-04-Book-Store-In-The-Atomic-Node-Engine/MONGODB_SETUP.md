# MongoDB Setup Guide

## ✅ Issues Fixed:
1. MongoDB connection was missing from index.js
2. Added connection with timeout handling
3. Restored proper async/await database operations
4. Schema matches form data perfectly

---

## 🚀 How to Run:

### Step 1: Start MongoDB
```bash
# Windows - Open PowerShell and run:
mongod

# Or if you have MongoDB installed locally:
# Make sure MongoDB service is running
```

### Step 2: Start the App
```bash
yarn run dev
```

### Step 3: Test It
- Go to: http://localhost:3000/add-book
- Fill the form and click "Add Book"
- Data will be saved to MongoDB

---

## 📊 Connection Details:
- **URI**: `mongodb://localhost:27017/bookstore`
- **Database**: `bookstore`
- **Collection**: `books`

---

## ✅ Troubleshooting:

### Error: "buffering timed out after 10000ms"
**Cause**: MongoDB is not running

**Solution**:
1. Open PowerShell/Terminal
2. Run: `mongod`
3. Keep it running
4. Run `yarn run dev` in another terminal

### Error: Connection refused
**Cause**: MongoDB service not started

**Solution**:
- Windows: Start MongoDB from Services
- Or install: `choco install mongodb` (if using Chocolatey)

### Check if MongoDB is running:
```bash
mongosh  # Opens MongoDB shell
> show databases  # Lists all databases
> use bookstore   # Switch to bookstore
> db.books.find()  # See all books
```

---

## 📝 Schema Fields:
- `bookTitle` - String (unique, required)
- `bookAuthor` - String (required)
- `bookDescription` - String (required)
- `bookPrice` - Number (required)
- `bookDealType` - String (required)
- `bookImage` - String (required)
- `createdAt` - Date (auto-generated)

---

## 🔍 Console Output:
When you add a book, you'll see:
```
📚 Book Data Received: {...}
✅ Book Saved to Database: {...}
```

Good luck! 🎉
