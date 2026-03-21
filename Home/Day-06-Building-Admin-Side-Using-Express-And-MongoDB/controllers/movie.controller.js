import Movie from "../models/movieModel.js";
import fs from "fs";

const movieController = {
  async addMovies(req, res) {
    try {
      req.body.poster = req.file ? req.file.path : "";
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
      fs.unlinkSync(deletedData.poster);
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
      const updatedData = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      console.log(updatedData);
      res.redirect("/admin/view-movie");
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};
export default movieController;
