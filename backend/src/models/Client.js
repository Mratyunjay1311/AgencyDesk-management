const mongoose = require("mongoose");

// A Client is a company the Agency works for (e.g. "Acme Corp").
// Projects belong to a Client. Client_user memberships point at one
// of these to say "which company does this portal user represent."
const clientSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Every list/lookup of clients is scoped by agency - index it directly
// so we never need to join through anything else to filter by tenant.
clientSchema.index({ agencyId: 1 });

module.exports = mongoose.model("Client", clientSchema);
