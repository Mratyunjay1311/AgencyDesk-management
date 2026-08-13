const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    uploadedById: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fileName: { type: String, required: true },
    // In this assignment we don't need real cloud storage - a local
    // path or placeholder URL is enough to prove the data model works.
    url: { type: String, required: true },

    clientVisible: { type: Boolean, default: false },

    // Only a client_user can change this, and only on files they're
    // allowed to see. "pending" is the default until a client acts.
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "needs_changes"],
      default: "pending",
    },
  },
  { timestamps: true }
);

fileSchema.index({ agencyId: 1, taskId: 1 });

module.exports = mongoose.model("File", fileSchema);
