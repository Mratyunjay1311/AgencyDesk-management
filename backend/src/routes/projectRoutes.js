const express = require("express");
const { createProject, listProjects, getProject } = require("../controllers/projectController");
const { requireSession, requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { projectHoursSummary } = require("../controllers/timeEntryController");
const { projectDashboard } = require("../controllers/taskController");

const projectRouter = express.Router();

projectRouter.use(requireSession);

projectRouter.post("/", requireRole("agency_admin"), asyncHandler(createProject));
projectRouter.get("/", asyncHandler(listProjects)); // all 3 roles allowed, filter narrows what they see
projectRouter.get("/:id", asyncHandler(getProject));

projectRouter.get("/:id/hours-summary", requireRole("agency_admin", "agency_member"), asyncHandler(projectHoursSummary));
projectRouter.get("/:id/dashboard", asyncHandler(projectDashboard))


module.exports = projectRouter;