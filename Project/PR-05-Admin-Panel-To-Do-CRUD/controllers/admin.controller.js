import Movie from "../models/movieModel.js";

const adminController = {
  AdminPage(req, res) {
    res.render("pages/admin.ejs");
  },
  async addMovie(req, res) {
    if (req.method === "POST") {
      const { movieTitle, genre, rating, movieDescription, movieRelease, movieDuration, poster } = req.body;

      // Validate movie duration
      const minDuration = 90; // Minimum duration in minutes
      const maxDuration = 300; // Maximum duration in minutes
      if (movieDuration < minDuration || movieDuration > maxDuration) {
        return res.status(400).send(`Movie duration must be between ${minDuration} and ${maxDuration} minutes.`);
      }

      try {
        const newMovie = new Movie({
          movieTitle,
          genre,
          rating,
          movieDescription,
          movieRelease: new Date(movieRelease),
          movieDuration,
          poster,
        });
        await newMovie.save();
        return res.redirect("/");
      } catch (error) {
        console.error("Error adding movie:", error);
        return res.status(500).send("Error adding movie");
      }
    }
    res.render("pages/add-movie.ejs");
  },
  async viewMovies(req, res) {
    const movies = await Movie.find({});
    res.render("pages/view-movie.ejs", { movies });
  },
};

export default adminController;
