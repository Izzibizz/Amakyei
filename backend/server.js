import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Projects } from "./models/projectSchema";
import projectData from "./data/projects.json";
import documentationRoutes from "./routes/documentation";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/user";

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

const app = express();
const port = process.env.PORT || 8080;

app.use(cors(/* "https://amakyei.netlify.app/" */));
app.use(express.json());
app.use("/", documentationRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
