const express = require("express");
const { updateApproval } = require("../controllers/fileController");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const fileDetailRouter = express.Router();

fileDetailRouter.patch("/:id/approval", requireRole("client_user"), asyncHandler(updateApproval));

module.exports = fileDetailRouter;