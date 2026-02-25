import Router from "express";
import homeController from "../controllers/home.controller.js";
import { auth } from "../middleware/authentication.js";

const homeRouter = Router();

homeRouter.get("/", homeController.AuthenticationPage);
homeRouter.post("/authenticate/visitor", homeController.AuthenticateVisitor);

homeRouter.get("/home", auth, homeController.HomePage);

export default homeRouter;

