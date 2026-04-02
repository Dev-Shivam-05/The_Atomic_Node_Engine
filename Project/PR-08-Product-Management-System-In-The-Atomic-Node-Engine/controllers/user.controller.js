import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import envConfig from "../../config/dotenv.js";
import jwt from 'jsonwebtoken';

let otp = null;
const userController = {
  async createUser(req, res) {
    try {
      if (req.file) {
        req.body.image = req.file.path;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = await userModel.create({
        ...req.body,
        password: hashedPassword,
      });

      return res
        .status(201)
        .json({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    } 
  },
  async getAllUsers(req, res) {
    try {
      const users = await userModel.find();
      return res
        .status(200)
        .json({ message: "Users fetched successfully", users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getUserById(req, res) {
    try {
      const user = await userModel.findById(req.params.id);
      return res
        .status(200)
        .json({ message: "User fetched successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async updateUser(req, res) {
    try {
      if (req.file) {
        req.body.image = req.file.path;
      }
      const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
      });
      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async deleteUser(req, res) {
    try {
      await userModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async verifyEmail(req, res) {
    try {
      let { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.isVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      user.otp = Math.floor(100000 + Math.random() * 900000);
      console.log(user.otp);
      await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: "your-email@gmail.com",
          pass: envConfig.USER_KEY,
        },
      });
      const mailOptions = {
        from: "your-email@gmail.com",
        to: user.email,
        subject: "Email Verification",
        text: `Your OTP is ${user.otp}`,
        html: `
          <h1>Email Verification</h1>
          <p>Welcome to our platform! To complete your registration, please verify your email address by entering the OTP (One-Time Password) below:</p>
          <p>Please note that this OTP is valid for 10 minutes. If you did not request this verification, please ignore this email.</p>
          <h2>Your OTP is <strong>${user.otp}</strong></h2>
          <p>Thank you for registering with us!</p>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log(mailOptions);
      return res
        .status(200)
        .json({ message: "Email verification OTP sent successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async verifyOtp(req, res) {
    try {
      let { userOtp } = req.body;
      userOtp = Number(userOtp);
      if (user.isVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      if (user.otp === userOtp) {
        return res.status(200).json({ message: "OTP verified successfully" });
      }
      return res.status(400).json({
        otp: otp,
        userOtp: userOtp,
        error: "Invalid OTP Please Check Your OTP Again.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async userLogin(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userModel.findOne({ $or: [{ username }, { email }] });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(400).json({ message: "Invalid Password" });

      const token = await jwt.sign({ userId: user._id }, envConfig.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ message: "Login Successful", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async userLogout(req, res) {
    try {
      const { userId } = req.user;
      const user = await userModel.findByIdAndUpdate(userId, { isVerified: false });
      return res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getShopData(req, res) {
    try {
      const user = await userModel.findById(req.user.userId);
      return res.status(200).json({ message: "Shop Data fetched successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default userController;
