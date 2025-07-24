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
    await Pedagog.deleteMany({});
    res.json({ message: "All Pedagog data deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Pedagog data." });
  }
});

export default router;
