const crypto = require("crypto");
const { Invite, User, Membership } = require("../models");
const { hashPassword } = require("../utils/password");

const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function createOrResendInvite(req, res) {
  const { email, role, clientId } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: "email and role are required" });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);

  const invite = await Invite.findOneAndUpdate(
    { agencyId: req.auth.agencyId, email: email.toLowerCase(), status: "pending" },
    { $set: { role, clientId: clientId || null, token, expiresAt } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ inviteId: invite._id, token: invite.token, expiresAt: invite.expiresAt });
}

async function acceptInvite(req, res) {
  const { password, name } = req.body;
  if (!password) {
    return res.status(400).json({ error: "password is required" });
  }

  const invite = await Invite.findOneAndUpdate(
    { token: req.params.token, status: "pending", expiresAt: { $gt: new Date() } },
    { $set: { status: "accepted" } },
    { new: false } // return the doc as it was BEFORE this update
  );

  if (!invite) {
    return res.status(400).json({ error: "This invite is invalid, expired, or already used" });
  }

    let user = await User.findOne({ email: invite.email });
  if (!user) {
    const passwordHash = await hashPassword(password);
    user = await User.create({ email: invite.email, passwordHash, name });
  }

  // Unique {userId, agencyId} index on Membership means this can't
  // silently create a duplicate membership even under a race.
  const membership = await Membership.findOneAndUpdate(
    { userId: user._id, agencyId: invite.agencyId },
    { $setOnInsert: { role: invite.role, clientId: invite.clientId, status: "active" } },
    { upsert: true, new: true }
  );

  res.status(201).json({ email: user.email, role: membership.role, agencyId: invite.agencyId });
}

module.exports = { createOrResendInvite, acceptInvite }