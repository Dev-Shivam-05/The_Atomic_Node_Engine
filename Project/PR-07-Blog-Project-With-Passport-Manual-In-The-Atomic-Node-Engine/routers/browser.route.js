import { Router } from "express";
import browserController from "../controllers/browser.controller.js";

const browserRouter = Router();

browserRouter.get('/', browserController.homePage);

export default browserRouter;