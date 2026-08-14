const mongoose = require("mongoose");


const clientSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);


clientSchema.index({ agencyId: 1 });

module.exports = mongoose.model("Client", clientSchema);
