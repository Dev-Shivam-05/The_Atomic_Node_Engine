import express from "express";
import session from "express-session";


const app = express();
const port = 3000;

app.use(session({
    secret: "Practice Session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge : 1000 * 60 * 60}
}))

app.get('/',(req,res)=>{
    if (req.session.author) {
        res.send(`The Author Name Is ${req.session.author}`);
    } else {
        res.send('No Session Found In Home Page');
    }
})

app.get('/get-session',(req,res)=>{
    if (req.session.author) {
        res.send(req.session);
    } else {
        res.send('No Session Found in Get Session');
    }
})

app.get('/destroy-session',(req,res)=>{
    console.log(req.session);
    if (req.session.author) {
        const deleteSession = req.session.author;
        req.session.destroy((err)=>{
            if (err) {
                res.send(err.message);
            }
            res.send(`${deleteSession} Is Succesfully deleted From The Session `);
        })
    } else {
        res.send('No Session Found');
    }
})

app.get('/create-session',(req,res)=>{
    req.session.author = "Shivam Bhadoriya";
    if (req.session.author) {
        res.send('Session is secussesfully created Wanna Check???');
    }
})

app.listen(port, (err) => {
    if (!err) {
        console.log('App listening on port 3000! Check It Out....');
        console.log(`http://localhost:${port}/`);
        
    }else{
        console.log(err.message);        
    }
});