const mongoose = require("mongoose");

// IMPORTANT DESIGN DECISION:
// User holds ONLY identity (email + password). It does NOT hold a role
// or an agencyId. Why? Because the same person (same email) can belong
// to two different agencies with two different roles - a client at
// Agency A and staff at Agency B. If we put role/agencyId directly on
// User, that becomes impossible to model cleanly. Instead, the
// relationship between a User and an Agency lives in a separate
// Membership document (see Membership.js).
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // one identity per email, globally
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
