const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const handleRequest = (req, res) => {
  const projectRoot = path.join(__dirname, "../");
  let filePath = "";

  switch (req.url) {
    case "/":
    case "/index":
    case "/index.html":
      filePath = path.join(projectRoot, "index.html");
      break;

    case "/albums":
      filePath = path.join(projectRoot, "pages", "albums.html");
      break;

    case "/pricing":
      filePath = path.join(projectRoot, "pages", "pricing.html");
      break;

    case "/checkout":
      filePath = path.join(projectRoot, "pages", "checkout.html");
      break;

    default:
      filePath = path.join(projectRoot, req.url);
      break;
  }

  fs.readFile(filePath, (err, result) => {
    if (!err) {
      res.end(result);
    } else {
      console.error("File missing:", filePath);

      const errorPagePath = path.join(projectRoot, "pages", "error.html");

      fs.readFile(errorPagePath, (err, errorContent) => {
        if (!err) {
          res.end(errorContent);
        } else {
          res.end("404: Page Not Found (Critical Error)");
        }
      });
    }
  });
};

const server = http.createServer(handleRequest);

server.listen(PORT, (err) => {
  if (!err) {
    console.log(`-----------------------------------------------`);
    console.log(`Server is running! Open this link in your browser:`);
    console.log(`http://localhost:${PORT}`);        
    console.log(`-----------------------------------------------`);
  }
});
