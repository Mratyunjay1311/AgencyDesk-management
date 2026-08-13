const mongoose = require("mongoose");

// This is the piece that solves "one person, two agencies."
// A Membership says: "this User has this role inside this Agency."
// A single user can have multiple Membership documents, one per agency.
//
// For role = client_user, clientId tells us WHICH client company inside
// that agency this person represents (a client contact only sees their
// own client's projects, not every client the agency has).
const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    role: {
      type: String,
      enum: ["agency_admin", "agency_member", "client_user"],
      required: true,
    },
    // Only set when role === "client_user". Points at the Client
    // document this person represents inside this agency.
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },

    // Used for the "removing a team member mid-task" edge case:
    // instead of hard-deleting a membership (which loses history),
    // we mark it inactive and reassign their open tasks.
    status: { type: String, enum: ["active", "removed"], default: "active" },
  },
  { timestamps: true }
);

// A given user should only have ONE membership per agency - prevents
// duplicate/conflicting roles for the same person in the same tenant.
membershipSchema.index({ userId: 1, agencyId: 1 }, { unique: true });

// Every membership lookup during auth is "find memberships for this
// user" - index it.
membershipSchema.index({ userId: 1 });

module.exports = mongoose.model("Membership", membershipSchema);
