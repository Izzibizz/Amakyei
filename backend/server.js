import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import documentationRoutes from "./routes/documentation";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/user";
import pedagogRoutes from "./routes/pedagog"

/* import pedagogData from "./data/pedagog.json"
import Pedagog from "./models/pedagogSchema" */

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/amakyei";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

/* const seedPedagog = async () => {
  try {
    console.log("Deleting old Pedagog data...");
    await Pedagog.deleteMany();

    console.log("Seeding new Pedagog data...");
    for (const item of pedagogData) {
      const newPedagog = new Pedagog(item);
      await newPedagog.save();
    }

    console.log("✅ Done seeding Pedagog data!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding Pedagog data:", err);
    process.exit(1);
  }
};

seedPedagog(); */

const app = express();
const port = process.env.PORT || 8081;

app.use(cors( "https://amakyei.netlify.app/", "http://localhost:8081" ));
app.use(express.json());
app.use("/", documentationRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/pedagog", pedagogRoutes);



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
