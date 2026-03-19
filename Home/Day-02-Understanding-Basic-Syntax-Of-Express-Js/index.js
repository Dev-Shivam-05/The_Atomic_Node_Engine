const express = require('express');
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log('App listening on port PORT!');
    console.log(`http://localhost:${PORT}`);
});

app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"));
