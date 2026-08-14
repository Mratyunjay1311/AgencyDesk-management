const express = require("express");
const { createTask, listTasks } = require("../controllers/taskController");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");


const taskRouter = express.Router({ mergeParams: true });

taskRouter.post("/", requireRole("agency_admin", "agency_member"), asyncHandler(createTask));
taskRouter.get("/", asyncHandler(listTasks)); // all 3 roles allowed, filter narrows results

module.exports = taskRouter;