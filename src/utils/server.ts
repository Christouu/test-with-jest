import express from "express";
import routes from "../routes";
import { deserializeUser } from "../middlewares/deserializeUser";

// we are making this function so that we dont start app.listen when we use supertest
export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(deserializeUser);

  routes(app);

  return app;
};
