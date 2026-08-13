function buildProjectFilter(auth) {
  const filter = { agencyId: auth.agencyId };

  if (auth.role === "agency_member") {
    filter.assignedMembers = auth.userId;
  } else if (auth.role === "client_user") {
    filter.clientId = auth.clientId;
  }

  return filter;
}

module.exports = { buildProjectFilter };