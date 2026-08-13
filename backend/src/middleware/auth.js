const { verifyToken } = require("../utils/jwt");

function getTokenFromHeader(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice(7);
}

function requireSession(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (payload.type !== "session") {
    return res.status(401).json({ error: "This endpoint requires a full session token" });
  }

  req.auth = {
    userId: payload.userId,
    agencyId: payload.agencyId,
    role: payload.role,
    clientId: payload.clientId,
    membershipId: payload.membershipId,
  };
  next();
}

function requireIdentity(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (payload.type !== "identity") {
    return res.status(401).json({ error: "This endpoint requires an identity token" });
  }

  req.identity = { userId: payload.userId };
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ error: "You don't have permission to perform this action" });
    }
    next();
  };
}

module.exports = { requireSession, requireIdentity, requireRole };   