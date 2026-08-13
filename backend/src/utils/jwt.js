const jwt = require("jsonwebtoken")

const IDENTITY_TOKEN_EXPIRY = "10m"

const SESSION_TOKEN_EXPIRY = "7d"

function signIdentityToken(user) {
  return jwt.sign(
    { type: "identity", userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: IDENTITY_TOKEN_EXPIRY }
  );
}

function signSessionToken({ userId, agencyId, role, clientId, membershipId }) {
  return jwt.sign(
    { type: "session", userId, agencyId, role, clientId, membershipId },
    process.env.JWT_SECRET,
    { expiresIn: SESSION_TOKEN_EXPIRY }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signIdentityToken, signSessionToken, verifyToken }