const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
   
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done"],
      default: "todo",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    dueDate: { type: Date, default: null },

    
    clientVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);


taskSchema.index({ agencyId: 1, projectId: 1 });

taskSchema.index({ agencyId: 1, clientVisible: 1 });
taskSchema.index({ assigneeId: 1 });

module.exports = mongoose.model("Task", taskSchema);
