import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  program: String,
  school: String,
  year: String
});

const projectSchema = new mongoose.Schema({
  year: String,
  title: String,
  description: String
});

const pedagogSchema = new mongoose.Schema({
  description: {
    title: String,
    text: String
  },
  education: [educationSchema],
  projects: [projectSchema]
});

const Pedagog = mongoose.model("Pedagog", pedagogSchema);
export default Pedagog;