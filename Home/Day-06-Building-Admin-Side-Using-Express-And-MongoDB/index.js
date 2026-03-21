import express from "express";
import router from "./routers/index.js";
import morgan from "morgan";
import db from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(express.urlencoded());
app.use(express.static('public'));
app.use('/uploads',express.static('uploads'));

app.use(morgan('dev'));

app.use(router);

app.listen(port, (err) => {
    if (!err) {
        console.log('App listening on port 3000!');
        console.log(`http://localhost:${port}/`);
    }
    else{
        console.log(err);
    }
});