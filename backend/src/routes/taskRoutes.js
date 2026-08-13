const express = require("express");
const { createTask, listTasks } = require("../controllers/taskController");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

// mergeParams lets this router read :projectId from the URL it gets
// mounted under in server.js.
const taskRouter = express.Router({ mergeParams: true });

taskRouter.post("/", requireRole("agency_admin", "agency_member"), asyncHandler(createTask));
taskRouter.get("/", asyncHandler(listTasks)); // all 3 roles allowed, filter narrows results

module.exports = taskRouter;