import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Routes
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import projectRoutes from "./routes/projects.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// ✅ MongoDB (IMPORTANT: use ENV)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");

    // ✅ Start server AFTER DB connects
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });

  })
  .catch(err => {
    console.log("DB Error:", err);
  });