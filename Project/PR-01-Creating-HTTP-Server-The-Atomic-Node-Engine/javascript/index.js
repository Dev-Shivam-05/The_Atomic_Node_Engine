const http = require("http");
const fs = require("fs");
// const { log } = require("console");

const PORT = 5500;

const handleRequest = (req, res) => {
  let fileName = "";

  switch (req.url) {
    case "/":
      fileName = "index.html";
      break;

    case "/albums":
      fileName = "albums.html";
      break;

    case "/pricing":
      fileName = "pricing.html";
      break;

    case "/checkout":
      fileName = "checkout.html";
      break;

    default:
      fileName = "error.html";
      break;
  }

  fs.readFile(fileName, (err, result) => {
    if (!err) {
      res.end(result);
    } else {
      console.error("File missing:", fileName);
      res.end("404: File Not Found");
    }
  });
};

const server = http.createServer(handleRequest);

server.listen(PORT, (err) => {
  if (!err) {
    console.log(`The server Is Successfully Live On :- `);
    console.log(`http://127.0.0.1:${PORT}`);
  }
});
