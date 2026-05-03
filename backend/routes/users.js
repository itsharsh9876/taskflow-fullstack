import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().select("_id name email");
  res.json(users);
});

export default router;