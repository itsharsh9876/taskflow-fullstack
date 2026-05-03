import express from "express";
import Project from "../models/Project.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();
router.use(auth);
// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    // 🔥 get admin from logged-in user
    const admin = req.user.id;

    if (!name) {
      return res.status(400).json({ msg: "Name required" });
    }

    const project = await Project.create({
      name,
      admin,
      members: [admin]
    });

    res.json(project);

  } catch (err) {
    console.log("PROJECT ERROR:", err);
    res.status(500).json({ msg: "Error creating project" });
  }
});

// GET PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

router.put("/:id/add-member", async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    // avoid duplicate
    if (!project.members.includes(userId)) {
      project.members.push(userId);
    }

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id/remove-member", async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔥 remove user
    project.members = project.members.filter(
      (id) => id.toString() !== userId
    );

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;