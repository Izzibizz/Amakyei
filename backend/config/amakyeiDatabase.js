import dotenv from "dotenv";
import mongoose from "mongoose";
import { Project } from "../models/projectSchema";
import projectData from "../data/projects.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/amakyei";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

if (process.env.RESET_DB === "true") {
    const seedDatabase = async () => {
      await Project.deleteMany();
      console.log("seeding data")
  
      projectData.forEach((projectData) => {
        new Project(projectData).save();
      });
    };
    seedDatabase();
  }

export default mongoose;
