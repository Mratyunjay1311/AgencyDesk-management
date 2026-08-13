const { Comment } = require("../models");
const { getAccessibleTask } = require("./taskController");

// POST /api/tasks/:taskId/comments
async function createComment(req, res) {
  const task = await getAccessibleTask(req.auth, req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { body } = req.body;
  if (!body) {
    return res.status(400).json({ error: "body is required" });
  }
    const clientVisible =
    req.auth.role === "client_user" ? true : !!(req.body.clientVisible ?? task.clientVisible);

  const comment = await Comment.create({
    agencyId: req.auth.agencyId,
    taskId: task._id,
    authorId: req.auth.userId,
    body,
    clientVisible,
  });

  res.status(201).json(comment);
}

async function listComments(req, res) {
  const task = await getAccessibleTask(req.auth, req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const filter = { agencyId: req.auth.agencyId, taskId: task._id };
  if (req.auth.role === "client_user") {
    filter.clientVisible = true; // same DB-level rule as tasks
  }

  const comments = await Comment.find(filter).sort({ createdAt: 1 });
  res.json(comments);
}

module.exports = { createComment, listComments }