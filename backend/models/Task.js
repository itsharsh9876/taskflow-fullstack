import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,

  status: { type: String, default: "To Do" },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  //  MULTIPLE USERS
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  
  dueDate: {
    type: Date
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  }
});

export default mongoose.model("Task", taskSchema);