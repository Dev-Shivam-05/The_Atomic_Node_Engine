import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";
import clientRoutes from "./routes/clientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { setFlashMessages } from "./middlewares/flashMiddleware.js";
import envConfig from "./config/dotenv.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
configurePassport(passport);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(setFlashMessages);

app.use("/", clientRoutes);
app.use("/admin", adminRoutes);


const port = envConfig.PORT || 3000;


app.listen(port, (error) => {
    if (!error) {
        console.log(`Server started on port`);
        console.log(`http://localhost:${port}`);
    }
});