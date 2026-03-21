import Movie from "../models/movieModel.js";

const adminController = {
  HomePage(req, res) {
    res.render("admin.ejs");
  },
  addMovie(req, res) {
    res.render("pages/add-movie.ejs");
  },
  async viewMovies(req, res) {
    const movies = await Movie.find({});
    res.render("pages/view-movie.ejs", { movies });
  },
};

export default adminController;
