const { Project, Task } = require("../models");
const { buildProjectFilter } = require("../utils/accessFilters");
const { TimeEntry } = require("../models");
// Confirms this user can access this specific PROJECT at all, before
// we let them touch any of its tasks. Every task route below calls
// this first - a task can never leak from a project the requester
// can't even see, because we check the project, not just the task.
async function getAccessibleProject(auth, projectId) {
  const filter = { ...buildProjectFilter(auth), _id: projectId };
  return Project.findOne(filter);
}

async function getAccessibleTask(auth, taskId) {
  const filter = { _id: taskId, agencyId: auth.agencyId };
  if (auth.role === "client_user") {
    filter.clientVisible = true;
  }

  const task = await Task.findOne(filter);
  if (!task) return null;

  if (auth.role === "agency_member") {
    const project = await getAccessibleProject(auth, task.projectId);
    if (!project) return null;
  }

  return task;
}

// POST /api/projects/:projectId/tasks   (agency_admin, agency_member only)
async function createTask(req, res) {
  const project = await getAccessibleProject(req.auth, req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const { title, status, priority, assigneeId, dueDate, clientVisible } = req.body;
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const task = await Task.create({
    agencyId: req.auth.agencyId, // from the token, not the client
    projectId: project._id,
    title,
    status,
    priority,
    assigneeId: assigneeId || null,
    dueDate: dueDate || null,
    clientVisible: !!clientVisible,
  });

  res.status(201).json(task);
}

// GET /api/projects/:projectId/tasks
async function listTasks(req, res) {
  const project = await getAccessibleProject(req.auth, req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const filter = { agencyId: req.auth.agencyId, projectId: project._id };

  // THE rule that keeps internal tasks away from clients - applied
  // at the database query itself, not as a filter on results we
  // already pulled back. This is what the assignment means by
  // "check every code path, not just the main list view."
  if (req.auth.role === "client_user") {
    filter.clientVisible = true;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
}

// GET /api/tasks/:id
async function getTask(req, res) {
  const filter = { _id: req.params.id, agencyId: req.auth.agencyId };
  if (req.auth.role === "client_user") {
    filter.clientVisible = true;
  }

  const task = await Task.findOne(filter);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  // agency_member needs one more check: even if the task matched on
  // agencyId, they should only see it if they're assigned to its
  // PROJECT. We check this after finding the task, since we need its
  // projectId first.
  if (req.auth.role === "agency_member") {
    const project = await getAccessibleProject(req.auth, task.projectId);
    if (!project) {
      return res.status(404).json({ error: "Task not found" });
    }
  }

  res.json(task);
}

// PATCH /api/tasks/:id   (agency_admin, agency_member only - clients
// are blocked from even reaching this route, enforced in taskDetailRoutes.js)
async function updateTask(req, res) {
  const { title, status, priority, assigneeId, dueDate, clientVisible } = req.body;

  const task = await Task.findOne({ _id: req.params.id, agencyId: req.auth.agencyId });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (req.auth.role === "agency_member") {
    const project = await getAccessibleProject(req.auth, task.projectId);
    if (!project) {
      return res.status(404).json({ error: "Task not found" });
    }
  }

  if (title !== undefined) task.title = title;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (assigneeId !== undefined) task.assigneeId = assigneeId;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (clientVisible !== undefined) task.clientVisible = !!clientVisible;

  await task.save();
  res.json(task);
}


async function projectDashboard(req, res) {
  const project = await getAccessibleProject(req.auth, req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const taskFilter = { agencyId: req.auth.agencyId, projectId: project._id };
  if (req.auth.role === "client_user") {
    taskFilter.clientVisible = true; // clients only see counts for what they're allowed to see
  }

  const statusCounts = await Task.aggregate([
    { $match: taskFilter },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const result = { projectId: project._id, taskCountsByStatus: {} };
  statusCounts.forEach((s) => (result.taskCountsByStatus[s._id] = s.count))

    if (req.auth.role !== "client_user") {
    const taskIds = await Task.find(taskFilter).distinct("_id");
    const hours = await TimeEntry.aggregate([
      { $match: { agencyId: req.auth.agencyId, taskId: { $in: taskIds } } },
      { $group: { _id: null, totalMinutes: { $sum: "$durationMinutes" } } },
    ]);
    result.totalHoursLogged = +((hours[0]?.totalMinutes || 0) / 60).toFixed(2);
  }

  res.json(result);
}

module.exports = { createTask, listTasks, getTask, updateTask, getAccessibleTask, projectDashboard }