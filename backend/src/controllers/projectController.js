const { Project } = require("../models")

function buildProjectFilter(auth) {
  const filter = { agencyId: auth.agencyId };

  if (auth.role === "agency_member") {
    filter.assignedMembers = auth.userId;
  } else if (auth.role === "client_user") {
    filter.clientId = auth.clientId;
  }
  

  return filter;
}

async function createProject(req, res) {
  const { name, description, clientId, assignedMembers } = req.body;
  if (!name || !clientId) {
    return res.status(400).json({ error: "name and clientId are required" });
  }

  const project = await Project.create({
    agencyId: req.auth.agencyId,
    clientId,
    name,
    description,
    assignedMembers: assignedMembers || [],
  });
  res.status(201).json(project);
}

async function listProjects(req, res) {
  const filter = buildProjectFilter(req.auth);
  const projects = await Project.find(filter).sort({ createdAt: -1 });
  res.json(projects);
}

async function getProject(req, res) {
  const filter = { ...buildProjectFilter(req.auth), _id: req.params.id };
  const project = await Project.findOne(filter);
  if (!project) {
   
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
}

module.exports = { createProject, listProjects, getProject };