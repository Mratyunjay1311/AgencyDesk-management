const express = require("express");
const { getTask, updateTask } = require("../controllers/taskController");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const taskDetailRouter = express.Router();

taskDetailRouter.get("/:id", asyncHandler(getTask)); // clients can view (if clientVisible)
taskDetailRouter.patch("/:id", requireRole("agency_admin", "agency_member"), asyncHandler(updateTask)); // clients can never edit

module.exports = taskDetailRouter;