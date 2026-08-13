const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // DENORMALIZED ON PURPOSE: even though we could get agencyId by
    // following projectId -> Project -> agencyId, we store it directly
    // here too. This means every task query can filter on
    // { agencyId: req.agencyId } with zero joins - a bug elsewhere in
    // the codebase can never leak a task across tenants, because the
    // safety check lives on the document itself.
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

    // The other half of the visibility rule: if false, a client_user
    // must never see this task, in any list, search, or comment.
    clientVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Almost every task query looks like: "tasks in this project, for this
// agency" - so index both together for the common access pattern.
taskSchema.index({ agencyId: 1, projectId: 1 });
// Client portal queries filter by agency + clientVisible together.
taskSchema.index({ agencyId: 1, clientVisible: 1 });
taskSchema.index({ assigneeId: 1 });

module.exports = mongoose.model("Task", taskSchema);
