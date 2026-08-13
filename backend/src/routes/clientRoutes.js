const express = require("express")

const asyncHandler = require("../utils/asyncHandler");
const { createClient, listClient, getClient } = require("../controllers/clientController");
const { requireRole, requireSession } = require("../middleware/auth");

const clientRouter = express.Router()


clientRouter.use(requireSession)

clientRouter.post("/", requireRole("agency_admin"), asyncHandler(createClient));
clientRouter.get("/", requireRole("agency_admin", "agency_member"), asyncHandler(listClient));
clientRouter.get("/:id", requireRole("agency_admin", "agency_member"), asyncHandler(getClient));


module.exports = clientRouter