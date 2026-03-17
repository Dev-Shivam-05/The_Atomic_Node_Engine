import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";

// Storage configuration
const storage = multer.memoryStorage(); // Use memory storage for processing with sharp

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit for profile pics
});

export const uploadProfilePic = upload.single("profilePic");

export const resizeProfilePic = async (req, res, next) => {
  if (!req.file) return next();

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  req.file.filename = `user-${uniqueSuffix}.webp`;
  req.file.path = `uploads/profiles/${req.file.filename}`;

  // Ensure directory exists
  if (!fs.existsSync("uploads/profiles")) {
    fs.mkdirSync("uploads/profiles", { recursive: true });
  }

  try {
    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(req.file.path);

    next();
  } catch (error) {
    console.error("Sharp Error:", error);
    next(error);
  }
};

// Also keep the original for blogs or refactor it
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadBlogImage = multer({
  storage: blogStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single("blogImage");
