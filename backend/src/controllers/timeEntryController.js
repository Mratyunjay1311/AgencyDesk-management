const { TimeEntry } = require("../models");
const { getAccessibleTask } = require("./taskController");
const { buildProjectFilter } = require("../utils/accessFilters");
const { Project } = require("../models");


async function logTime(req, res) {
  const task = await getAccessibleTask(req.auth, req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { durationMinutes, note, date } = req.body;
  if (!durationMinutes || !date) {
    return res.status(400).json({ error: "durationMinutes and date are required" });
  }
  const entry = await TimeEntry.create({
    agencyId: req.auth.agencyId,
    taskId: task._id,
    userId: req.auth.userId,
    durationMinutes,
    note,
    date,
  });

  res.status(201).json(entry);
}

async function projectHoursSummary(req, res) {
  const projectFilter = { ...buildProjectFilter(req.auth), _id: req.params.projectId };
  const project = await Project.findOne(projectFilter);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  
  const { Task } = require("../models");
  const taskIds = await Task.find({ agencyId: req.auth.agencyId, projectId: project._id }).distinct("_id");

  const totalMinutes = await TimeEntry.aggregate([
    { $match: { agencyId: project.agencyId, taskId: { $in: taskIds } } },
    { $group: { _id: null, totalMinutes: { $sum: "$durationMinutes" } } },
  ]);
   const minutes = totalMinutes[0]?.totalMinutes || 0;
  res.json({ projectId: project._id, totalMinutes: minutes, totalHours: +(minutes / 60).toFixed(2) });
}

module.exports = { logTime, projectHoursSummary }