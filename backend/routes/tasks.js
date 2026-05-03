import express from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// CREATE TASK

router.post("/", async (req, res) => {
  try {
    let { assignedTo, ...rest } = req.body;

    // 🔥 fix: normalize assignedTo
    if (typeof assignedTo === "string") {
      assignedTo = [assignedTo];
    }

    if (!Array.isArray(assignedTo)) {
      assignedTo = [];
    }

    const task = await Task.create({
      ...rest,
      assignedTo
    });

    res.json(task);
  } catch (err) {
    console.log("CREATE TASK ERROR:", err);
    res.status(500).json(err);
  }
});

// GET TASKS (with optional project filter)
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;

    const filter = projectId ? { projectId } : {};
    const tasks = await Task.find(filter).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// UPDATE TASK (status or anything)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Not found" });

    if (
      req.user.role !== "Admin" &&
      task.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update error" });
  }
});

// DELETE TASK


router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Only admin can delete" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete error" });
  }
});

export default router;