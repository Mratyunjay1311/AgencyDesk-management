const { Membership, Project, Task } = require("../models")

async function removeMember(req, res) {
  const membership = await Membership.findOne({ _id: req.params.id, agencyId: req.auth.agencyId });
  if (!membership) {
    return res.status(404).json({ error: "Membership not found" });
  }

  membership.status = "removed";
  await membership.save();

 
  await Project.updateMany(
    { agencyId: req.auth.agencyId, assignedMembers: membership.userId },
    { $pull: { assignedMembers: membership.userId } }
  );
    const { modifiedCount } = await Task.updateMany(
    { agencyId: req.auth.agencyId, assigneeId: membership.userId },
    { $set: { assigneeId: null } }
  );

  res.json({ removed: true, tasksUnassigned: modifiedCount });
}

module.exports = { removeMember };