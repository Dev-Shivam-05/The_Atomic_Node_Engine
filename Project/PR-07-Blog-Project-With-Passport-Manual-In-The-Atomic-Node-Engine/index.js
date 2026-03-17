import express from "express";
import router from "./routers/index.js";
import db from "./config/database.js";
import envConfig from "./config/dotenv.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import configurePassport from "./config/passport-local-strategy.js";

const app = express();
const port = envConfig.PORT || 3000;

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});
app.use("/api/auth", limiter);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(morgan("dev"));
app.use(cookieParser());

// Simple Session management (Cookie-based)
app.use(session({
  name: "blog_session",
  secret: "shivam_hardcoded_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

app.use(flash());

// Middleware for user state and flash messages
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(router);

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server started on http://localhost:${port}/`);
  } else {
    console.log(err.message);
  }
});
