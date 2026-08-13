const mongoose = require("mongoose");

// Time entries are agency-internal only - clients never see hours
// logged, so this collection has no clientVisible flag at all. That
// itself is a design decision worth stating in DESIGN.md: some data
// doesn't need a visibility flag because it's never client-facing by
// definition, and every read path for this collection must require
// an agency staff role.
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
