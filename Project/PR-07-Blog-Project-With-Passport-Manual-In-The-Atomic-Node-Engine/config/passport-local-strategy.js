import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const configurePassword = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          // 1. Check for Hard-coded Admin Login
          if (username === "admin" && password === "admin123") {
            const adminUser = {
              id: "hardcoded_admin_id",
              userName: "admin",
              role: "admin",
              profilePic: "default-profile.png"
            };
            return done(null, adminUser);
          }

          // 2. Regular User Login from Database
          const user = await User.findOne({ userName: username });
          if (!user) {
            return done(null, false, { message: "User not found." });
          }

          const isPasswordValid = await bcrypt.compare(password, user.userPassword);
          if (!isPasswordValid) {
            return done(null, false, { message: "Invalid credentials." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    try {
      // If it's the hardcoded admin, return it directly
      if (user.id === "hardcoded_admin_id") {
        return done(null, user);
      }
      // Otherwise, get fresh data from DB
      const freshUser = await User.findById(user._id || user.id);
      done(null, freshUser);
    } catch (error) {
      done(error);
    }
  });
};

export default configurePassword;