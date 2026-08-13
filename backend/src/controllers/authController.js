const { User, Agency, Membership } = require("../models");
const { hashPassword, comparePassword } = require("../utils/password");
const { signIdentityToken, signSessionToken } = require("../utils/jwt");


async function register(req, res) {
  const { email, password, name, agencyName } = req.body;

  if (!email || !password || !agencyName) {
    return res.status(400).json({ error: "email, password, and agencyName are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, name });
  const agency = await Agency.create({ name: agencyName });
  const membership = await Membership.create({
    userId: user._id,
    agencyId: agency._id,
    role: "agency_admin",
  });

    const token = signSessionToken({
    userId: user._id.toString(),
    agencyId: agency._id.toString(),
    role: membership.role,
    clientId: null,
    membershipId: membership._id.toString(),
  });

  res.status(201).json({
    token,
    agency: { id: agency._id, name: agency.name },
    role: membership.role,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  // Same error message whether the email doesn't exist or the
  // password is wrong - don't leak which case it was.
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const validPassword = await comparePassword(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid email or password" });
  }


    const memberships = await Membership.find({ userId: user._id, status: "active" })
    .populate("agencyId", "name")
    .lean();

  if (memberships.length === 0) {
    return res.status(403).json({ error: "This account has no active agency memberships" });
  }

  const identityToken = signIdentityToken(user);

  res.json({
    identityToken,
    memberships: memberships.map((m) => ({
      membershipId: m._id,
      agencyId: m.agencyId._id,
      agencyName: m.agencyId.name,
      role: m.role,
      clientId: m.clientId,
    })),
  });
}

async function selectAgency(req, res) {
  const { membershipId } = req.body;

  if (!membershipId) {
    return res.status(400).json({ error: "membershipId is required" });
  }

  const membership = await Membership.findOne({
    _id: membershipId,
    userId: req.identity.userId,
    status: "active",
  });

  if (!membership) {
    return res.status(403).json({ error: "That membership doesn't belong to you or is inactive" });
  }

  const token = signSessionToken({
    userId: req.identity.userId,
    agencyId: membership.agencyId.toString(),
    role: membership.role,
    clientId: membership.clientId ? membership.clientId.toString() : null,
    membershipId: membership._id.toString(),
  })

    res.json({ token, agencyId: membership.agencyId, role: membership.role });
}

module.exports = { register, login, selectAgency }