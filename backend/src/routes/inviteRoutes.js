const express = require("express");
const { createOrResendInvite, acceptInvite } = require("../controllers/inviteController");
const { requireSession, requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const inviteRouter = express.Router();

inviteRouter.post("/", requireSession, requireRole("agency_admin"), asyncHandler(createOrResendInvite));
inviteRouter.post("/:token/accept", asyncHandler(acceptInvite)); // public, no session needed

module.exports = inviteRouter