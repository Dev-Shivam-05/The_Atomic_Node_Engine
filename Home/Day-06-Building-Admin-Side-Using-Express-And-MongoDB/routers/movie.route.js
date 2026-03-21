import { Router } from "express";
import imageUpload from "../middleware/imageUpload.js";
import Movie from "../models/movieModel.js";
import movieController from "../controllers/movie.controller.js";

const movieRouter = Router();

movieRouter.post('/add-movie',imageUpload,movieController.addMovies);

movieRouter.post('/delete-movie/:id',movieController.deleteMovie);

movieRouter.get('/edit-movie/:id',movieController.editMovie);

movieRouter.post('/edit-movie/:id',imageUpload,movieController.updateMovie);

export default movieRouter;