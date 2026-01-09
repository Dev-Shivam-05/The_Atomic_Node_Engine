# ⚛️ The Atomic Node Engine: Custom HTTP Server

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> **A raw, deep-dive implementation of a web server built entirely from scratch using the native Node.js `http` module.** No Express, no frameworks—just pure JavaScript logic.

---

## 🚀 Live Preview

Check out the live version of the project deployed on Vercel:

### [🔗 Click Here to Visit the Live Server](https://pr-01-creating-http-server-the-atom.vercel.app/)

---

## 📖 About The Project

This project explores the fundamentals of backend web development. Instead of relying on heavy frameworks, I built a custom server engine that handles browser requests manually. This demonstrates how data flows between the client and server at a low level.

### Key Features
* **⚡ Zero Dependencies:** Built using only Node.js core modules (`http`, `fs`, `path`).
* **🔀 Custom Routing:** Manual implementation of a routing system using `switch` cases.
* **📂 File System Serving:** Dynamically reads and serves HTML, CSS, and Image files using the `fs` module.
* **🚫 Error Handling:** A custom 404 Error page detection system for broken links.
* **⚙️ Logic-Based Navigation:** Handles clean URLs (e.g., serving `index.html` when `/` is requested).

---

## 📂 Project Structure

A clean and modular architecture separate logic from assets.

```bash
PR-01-CREATING-HTTP-SERVER
├── 📂 css/              # Stylesheets
│   └── style.css
├── 📂 images/           # Static Assets (WebP, JPG, PNG)
├── 📂 javascript/       # Server Logic
│   └── index.js         # 🟢 The Core Server Entry Point
├── 📂 pages/            # HTML Views
│   ├── albums.html
│   ├── checkout.html
│   ├── pricing.html
│   └── error.html       # Custom 404 Page
├── index.html           # Landing Page
└── README.md

```

---

## 🛠️ How It Works (The Code)

Here is a snippet of the custom routing logic that powers the server. It intercepts the request URL and decides which file to deliver to the user.

```javascript
const handleRequest = (req, res) => {
  const projectRoot = path.join(__dirname, "../");
  let filePath = "";

  switch (req.url) {
    case "/":
    case "/index":
      // Serve the Homepage
      filePath = path.join(projectRoot, "index.html");
      break;
      
    case "/albums":
      // Serve the Albums Page
      filePath = path.join(projectRoot, "pages", "albums.html");
      break;

    default:
      // Handle static files or 404 errors dynamically
      filePath = path.join(projectRoot, req.url);
      break;
  }
  // ... file reading logic follows
};

```

---

## 💻 Getting Started (Run Locally)

Want to run this atomic engine on your own machine? Follow these steps:          

**1. Clone the repository**

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

```

**2. Navigate to the project folder**

```bash
cd PR-01-CREATING-HTTP-SERVER

```

**3. Start the Server**

> **Note:** We do not use the VS Code "Go Live" button here. We run the native node server.

```bash
node javascript/index.js

```

**4. View in Browser**
Open your web browser and visit:
`http://localhost:3000`

---

## 🧠 Learning Outcomes

By building this, I mastered:

* How **Requests** and **Responses** work in the HTTP protocol.
* Reading files asynchronously with `fs.readFile`.
* Manipulating file paths using the `path` module.
* Handling MIME types and Status Codes (200 vs 404) manually.

---

### 👨‍💻 Author

Developed with ❤️ by **[@Shivam]**

*If you liked this project, give it a ⭐ on GitHub!*

```

```