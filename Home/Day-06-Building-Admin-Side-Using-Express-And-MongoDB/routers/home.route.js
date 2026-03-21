import Router from "express";
import Movie from "../models/movieModel.js";

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
  const dataSet = await Movie.find({});
  res.render("index", { dataSet });
});

export default homeRouter;
