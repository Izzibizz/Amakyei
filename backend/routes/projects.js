import express from "express";
import Projects from "../models/projectSchema";

const router = express.Router();

//Product Endpoints
router.get("/", async (req, res) => {
  try {
    const project = await Projects.find().exec();
    //For Search bar in Frontend use this endpoint as well
    const projectTitle = req.query.title;

    if (projectTitle) {
      const titleSearch = async (projectTitle) => {
        const resultSearch = await Projects.find({
          title: { $regex: new RegExp(projectTitle, "i") },
        }).exec();
        return resultSearch;
      };
      const titleResults = await titleSearch(projectTitle);
      if (titleResults.length > 0) {
        res.status(200).json({
          titleResults: titleResults,
          message: "The following project were found.",
        });
      } else {
        res.status(404).json({ message: "Sorry, we didn't find any project." });
      }
    } else if (project.length > 0) {
      res.status(200).json({
        project: project,
        message: "The following projects excists.",
      });
    } else {
      res.status(404).json({
        message: "Sorry, we didn't find any project.",
      });
    }
  } catch (error) {
    console.error("The following error occured:", error);
    res.status(500).json({
      message:
        "Sorry, this page is not available at the moment. Please try again later.",
    });
  }
});

router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Projects.findOne({ _id: projectId }).exec();

    if (project) {
      res
        .status(200)
        .json({ project: project, message: "The project was found." });
    } else {
      res.status(404).json({
        message: "Sorry, there is no project with that search criteria.",
      });
    }
  } catch (error) {
    console.error("The followind error occured:", error);
    res.status(500).json({
      message:
        "Sorry, this page is not available at the moment. Please try again later.",
    });
  }
});

// Create a new project
router.post("/newProject", async (req, res) => {
  try {
    const newProject = new Projects(req.body);
    await newProject.save();
    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project" });
  }
});

// Update an existing project
router.patch("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const updatedProject = await Projects.findByIdAndUpdate(projectId, req.body, { new: true });

    if (updatedProject) {
      res.status(200).json({ message: "Project updated successfully", project: updatedProject });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project" });
  }
});

// Delete a project
router.delete("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const deletedProject = await Projects.findByIdAndDelete(projectId);

    if (deletedProject) {
      res.status(200).json({ message: "Project deleted successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
});

export default router;