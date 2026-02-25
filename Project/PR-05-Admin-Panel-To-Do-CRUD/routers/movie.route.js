import { Router } from "express";
import imageUpload from "../middleware/imageUpload.js";
import Movie from "../models/movieModel.js";
import movieController from "../controllers/movie.controller.js";
import { adminAuth, auth } from "../middleware/authentication.js";

const movieRouter = Router();

movieRouter.post(
  "/add-movie",
  auth,
  adminAuth,
  imageUpload,
  movieController.addMovies,
);
movieRouter.post(
  "/delete-movie/:id",
  auth,
  adminAuth,
  movieController.deleteMovie,
);
movieRouter.get("/edit-movie/:id", auth, adminAuth, movieController.editMovie);
movieRouter.post(
  "/edit-movie/:id",
  auth,
  adminAuth,
  imageUpload,
  movieController.updateMovie,
);
movieRouter.get("/:id", auth, movieController.movieDetail);

export default movieRouter;
