import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Projects from "./models/projectSchema";
import projectData from "./data/projects.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/amakyei";

mongoose.connect(mongoUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000 // Increase timeout for server selection
  });
  
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");


if (process.env.RESET_DB === "true") {
    const seedDatabase = async () => {
      try {
        await Projects.deleteMany();
        console.log("Database cleared. Seeding data...");

        await Projects.insertMany(projectData); // Use insertMany for bulk insert
        console.log("Database seeded successfully");
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    };
    seedDatabase();
  }
})

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the process if the connection fails
});

const app = express();
app.use(cors(/* "https://amakyei.netlify.app/" */));
app.use(express.json());

//Import from seeding so that is runs
import documentationRoutes from "./routes/documentation";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/user";

// Add middlewares to enable cors and json body parsing
app.use("/", documentationRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);

export default app;
