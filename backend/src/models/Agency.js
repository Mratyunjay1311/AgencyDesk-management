const mongoose = require("mongoose");


const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agency", agencySchema);
