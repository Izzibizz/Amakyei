import express from "express";

import { Project } from "../models/projectSchema";

const router = express.Router();

//Product Endpoints
router.get("/", async (req, res) => {
  try {
    const project = await Project.find().exec();
    //For Search bar in Frontend use this endpoint as well
    const projectTitle = req.query.title;

    if (projectTitle) {
      const titleSearch = async (projectTitle) => {
        const resultSearch = await Project.find({
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
    const project = await Project.findOne({ _id: projectId }).exec();

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

export default router;