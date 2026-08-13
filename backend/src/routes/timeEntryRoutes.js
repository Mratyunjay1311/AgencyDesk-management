const express = require("express");
const { logTime } = require("../controllers/timeEntryController");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const timeEntryRouter = express.Router({ mergeParams: true });

timeEntryRouter.post("/", requireRole("agency_admin", "agency_member"), asyncHandler(logTime));

module.exports = timeEntryRouter