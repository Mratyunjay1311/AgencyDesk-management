const express = require("express");
const { removeMember } = require("../controllers/membershipController");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const membershipRouter = express.Router();

membershipRouter.patch("/:id/remove", requireRole("agency_admin"), asyncHandler(removeMember));

module.exports = membershipRouter;