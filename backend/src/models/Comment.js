const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true }, // denormalized, same reasoning as Task
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true },

    clientVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ agencyId: 1, taskId: 1 });

module.exports = mongoose.model("Comment", commentSchema);
