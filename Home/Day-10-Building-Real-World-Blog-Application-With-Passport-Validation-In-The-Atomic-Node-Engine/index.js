import express from 'express';
import envConfig from './config/dotenv.js';
import connectDB from './config/database.js';
import passport from './config/passport-local-strategy.js';
import session from 'express-session';
import flash from 'connect-flash';

const app = express();

const port = envConfig.PORT || 3000;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // 30 days
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads',express.static('uploads'));
app.use(flash());

app.listen(port, (error) => {
    if (error) {
        console.log(`Error starting server: ${error.message}`);
        process.exit(1);
    }
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});