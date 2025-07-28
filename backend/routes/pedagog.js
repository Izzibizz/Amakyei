import express from "express";
import Pedagog from "../models/pedagogSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await Pedagog.findOne();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Pedagog content." });
  }
});

router.post("/", async (req, res) => {
  try {
    const existing = await Pedagog.findOne();
    if (existing) {
      const updated = await Pedagog.findByIdAndUpdate(existing._id, req.body, { new: true });
      res.json(updated);
    } else {
      const created = new Pedagog(req.body);
      await created.save();
      res.status(201).json(created);
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to save Pedagog content." });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { type, id } = req.body;

    if (!["education", "project"].includes(type) || !id) {
      return res.status(400).json({ message: "Invalid delete request." });
    }

    const pedagog = await Pedagog.findOne();
    if (!pedagog) {
      return res.status(404).json({ message: "Pedagog not found." });
    }

    if (type === "education") {
      pedagog.education = pedagog.education.filter(item => item._id.toString() !== id);
    } else if (type === "project") {
      pedagog.projects = pedagog.projects.filter(item => item._id.toString() !== id);
    }

    await pedagog.save();
    res.json(pedagog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete item from Pedagog." });
  }
});



export default router;
