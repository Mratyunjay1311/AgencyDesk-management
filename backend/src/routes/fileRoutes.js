const express = require("express");
const { uploadFile, listFiles } = require("../controllers/fileController");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const fileRouter = express.Router({ mergeParams: true });

fileRouter.post("/", requireRole("agency_admin", "agency_member"), asyncHandler(uploadFile));
fileRouter.get("/", asyncHandler(listFiles));

module.exports = fileRouter;