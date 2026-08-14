const mongoose = require("mongoose");


const timeEntrySchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    durationMinutes: { type: Number, required: true, min: 1 },
    note: { type: String, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

timeEntrySchema.index({ agencyId: 1, taskId: 1 });

module.exports = mongoose.model("TimeEntry", timeEntrySchema);
