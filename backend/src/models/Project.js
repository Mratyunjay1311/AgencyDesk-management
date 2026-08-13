const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
     assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

projectSchema.index({ agencyId: 1 });
projectSchema.index({ clientId: 1 });

module.exports = mongoose.model("Project", projectSchema);
