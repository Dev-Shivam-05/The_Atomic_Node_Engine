import Movie from "../models/movieModel.js";
import fs from "fs";

const movieController = {
  async addMovies(req, res) {
    try {
      req.body.poster = req.file ? req.file.path : "";
      const toList = (value) =>
        (value || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      const toPeople = (value) =>
        toList(value).map((entry) => {
          const [name, role] = entry.split(":").map((text) => text.trim());
          return { name, role };
        });
      if (req.body.castText) req.body.cast = toPeople(req.body.castText);
      if (req.body.crewText) req.body.crew = toPeople(req.body.crewText);
      if (req.body.trailerText) req.body.trailerLinks = toList(req.body.trailerText);
      console.log(req.body);
      const newMovie = await Movie.create(req.body);
      return res.redirect(req.get("Referrer") || "/");
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      const deletedData = await Movie.findByIdAndDelete(id);
      console.log(deletedData);
      if (deletedData.poster) {
        fs.unlinkSync(deletedData.poster, (err) => {
          if (err) {
            console.log("Error in deleting image: " + err.message);
          } else {
            console.log("Image Is Successfully Deleted...");
          }
        });
      }
      res.redirect("/admin/view-movie");
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  async editMovie(req, res) {
    try {
      const { id } = req.params;
      const editData = await Movie.findById(id);
      res.render("pages/edit-movie.ejs", { editData });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const existingMovie = await Movie.findById(id);
      const toList = (value) =>
        (value || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      const toPeople = (value) =>
        toList(value).map((entry) => {
          const [name, role] = entry.split(":").map((text) => text.trim());
          return { name, role };
        });

      if (req.file) {
        if (existingMovie) {
          fs.unlinkSync(existingMovie.poster, (err) => {
            if (err) {
              console.log("Error in deleting old image :- " + err.message);
            } else {
              console.log("old Image Is Successfully Deleted...");
            }
          });
        }
      }
      req.body.poster = req.file ? req.file.path : "";
      if (req.body.castText !== undefined) {
        req.body.cast = toPeople(req.body.castText);
      }
      if (req.body.crewText !== undefined) {
        req.body.crew = toPeople(req.body.crewText);
      }
      if (req.body.trailerText !== undefined) {
        req.body.trailerLinks = toList(req.body.trailerText);
      }
      const updatedData = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      console.log(updatedData);
      res.redirect("/admin/view-movie");
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  async movieDetail(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id).lean();
      if (!movie) {
        return res.status(404).render("pages/movie-detail.ejs", {
          movie: null,
          error: "Movie not found",
        });
      }
      res.render("pages/movie-detail.ejs", { movie, error: null });
    } catch (error) {
      res.status(500).render("pages/movie-detail.ejs", {
        movie: null,
        error: "Unable to load movie details",
      });
    }
  },
};
export default movieController;
