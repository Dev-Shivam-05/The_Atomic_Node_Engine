import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadImage = multer({ storage: storage }).single("Image");

export default uploadImage;
