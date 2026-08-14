const { File } = require("../models");
const { getAccessibleTask } = require("./taskController");


async function uploadFile(req, res) {
  const task = await getAccessibleTask(req.auth, req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { fileName, url, clientVisible } = req.body;
  if (!fileName || !url) {
    return res.status(400).json({ error: "fileName and url are required" });
  }
   const file = await File.create({
    agencyId: req.auth.agencyId,
    taskId: task._id,
    uploadedById: req.auth.userId,
    fileName,
    url,
    clientVisible: !!clientVisible,
  });

  res.status(201).json(file);
}

async function listFiles(req, res) {
  const task = await getAccessibleTask(req.auth, req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const filter = { agencyId: req.auth.agencyId, taskId: task._id };
  if (req.auth.role === "client_user") {
    filter.clientVisible = true;
  }

  const files = await File.find(filter).sort({ createdAt: -1 });
  res.json(files);
}

async function updateApproval(req, res) {
  const { approvalStatus } = req.body;
  if (!["approved", "needs_changes"].includes(approvalStatus)) {
    return res.status(400).json({ error: "approvalStatus must be 'approved' or 'needs_changes'" });
  }

 
  const file = await File.findOne({
    _id: req.params.id,
    agencyId: req.auth.agencyId,
    clientVisible: true,
  });
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

   const task = await getAccessibleTask(req.auth, file.taskId);
  if (!task) {
    return res.status(404).json({ error: "File not found" });
  }

  file.approvalStatus = approvalStatus;
  await file.save();
  res.json(file);
}

module.exports = { uploadFile, listFiles, updateApproval }