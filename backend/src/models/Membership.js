const mongoose = require("mongoose");


const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    role: {
      type: String,
      enum: ["agency_admin", "agency_member", "client_user"],
      required: true,
    },
   
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },

   
    status: { type: String, enum: ["active", "removed"], default: "active" },
  },
  { timestamps: true }
);


membershipSchema.index({ userId: 1, agencyId: 1 }, { unique: true });

membershipSchema.index({ userId: 1 });

module.exports = mongoose.model("Membership", membershipSchema);
