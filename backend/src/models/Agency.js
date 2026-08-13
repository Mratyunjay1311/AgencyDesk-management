const mongoose = require("mongoose");

// Agency is the "tenant" itself. Every other tenant-owned collection
// points back to one of these via an agencyId field.
const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agency", agencySchema);
