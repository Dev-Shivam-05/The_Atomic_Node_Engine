import Movie from "../models/movieModel.js";

const homeController = {
  AuthenticationPage(req, res) {
    res.render("pages/authentication.ejs");
  },
  AuthenticateVisitor(req, res) {
    const { username, password } = req.body;
    console.log("req.body :- ", req.body);
    console.log("Received credentials:", { username, password });
    if (username == "admin1" && password == "adminpassword") {
      res.cookie("user", JSON.stringify({ username, role: "admin" }), {
        httpOnly: true,
      });
      return res.redirect("/admin");
    } else if (username == "user1" && password == "userpassword") {
      res.cookie("user", JSON.stringify({ username, role: "user" }), {
        httpOnly: true,
      });
      return res.redirect("/home");
    } else {
      res.clearCookie("user");
      return res.redirect("/");
    }
  },
  // async HomePage(req, res) {
  //   const dataSet = await Movie.find({});
  //   res.render("index.ejs", {
  //     movies: dataSet,
  //   });
  // },
  async HomePage(req, res) {
    try {
      console.log("🏠 HomePage called");

      const dataSet = await Movie.find({});

      console.log("📊 Movies found:", dataSet.length);
      console.log("📊 First movie:", JSON.stringify(dataSet[0], null, 2));

      res.render("index.ejs", {
        movies: dataSet,
      });
    } catch (error) {
      console.error("❌ Error:", error);
      res.render("index.ejs", {
        movies: [],
      });
    }
  },
};

export default homeController;
