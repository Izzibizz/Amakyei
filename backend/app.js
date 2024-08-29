import cors from "cors";
import express from "express";

//Import from seeding so that is runs
import documentationRoutes from "./routes/documentation";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/user";

const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors(/* "https://amakyei.netlify.app/" */));
app.use(express.json());
app.use("/", documentationRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);

export default app;
