import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import { RegisterRoutes } from "./routes/index";
import errorHandler from "./middlewares/errorHandler";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(cors({ // Ajouter CORS ici
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  }),
);

RegisterRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});