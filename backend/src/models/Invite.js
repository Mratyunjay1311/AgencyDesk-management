const mongoose = require("mongoose");

// Solves the "invite races" edge case:
//  - "Resending shouldn't duplicate it": we enforce ONE pending invite
//    per (agencyId, email) using a partial unique index below, so
//    "resend" in the API is really "update the existing pending
//    invite's token/expiry," never "insert a new row."
//  - "Accepting twice shouldn't create two accounts": token is
//    globally unique, and acceptance is an atomic
//    findOneAndUpdate({ token, status: "pending" }, { status: "accepted" })
//    - only the first request to hit that atomic update wins; a
//    second, near-simultaneous accept finds no matching "pending"
//    document and is rejected instead of creating a duplicate user.
const inviteSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ["agency_admin", "agency_member", "client_user"],
      required: true,
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },

    token: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);


inviteSchema.index(
  { agencyId: 1, email: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

module.exports = mongoose.model("Invite", inviteSchema);
