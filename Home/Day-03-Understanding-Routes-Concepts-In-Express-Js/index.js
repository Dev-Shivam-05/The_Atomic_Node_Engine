const express = require('express');
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log('App listening on port 3000!');
    console.log(`http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send("<h1>Home Page<\h1>");
});

app.get('/about', (req, res) => {
    res.send("<h1>About Page<\h1>");
});

app.get('/user', (req, res) => {
    res.send("<h1>User Page<\h1>");
});

app.get('/contact', (req, res) => {
    res.send("<h1>Contact Page<\h1>");
});

app.get('/user/:user_id/:user_name', (req, res) => {
    res.send(`User Id : ${req.params.user_id} & User Name :- ${req.params.user_name}`);
});

app.get('/search', (req, res) => {
    res.send(`${req.params}`);
});

