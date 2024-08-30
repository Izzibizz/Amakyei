import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Projects from "./models/projectSchema";
import projectData from "./data/projects.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/amakyei";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

if (process.env.RESET_DB) {
    const seedDatabase = async () => {
      await Projects.deleteMany();
      console.log("seeding data")
  
      projectData.forEach((projectData) => {
        new Projects(projectData).save();
      });
    };
    seedDatabase();
  }

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
