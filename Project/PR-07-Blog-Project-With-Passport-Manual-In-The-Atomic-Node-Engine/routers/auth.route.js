import express from "express";
import authController from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { uploadProfilePic, resizeProfilePic } from "../middleware/imageUpload.js";

const router = express.Router();

const registrationValidation = [
  body("userName").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("userEmail").isEmail().withMessage("Please enter a valid email"),
  body("userPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.userPassword) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  })
];

router.get("/register", authController.getRegister);
router.post("/register", uploadProfilePic, resizeProfilePic, registrationValidation, authController.postRegister);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.logout);

export default router;