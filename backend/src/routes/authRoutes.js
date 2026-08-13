const express = require("express")
const asyncHandler = require("../utils/asyncHandler")
const { login, selectAgency, register } = require("../controllers/authController")
const { requireIdentity } = require("../middleware/auth")

const authRouter = express.Router()

authRouter.post("/register",asyncHandler(register))
authRouter.post("/login",asyncHandler(login))

authRouter.post("/select-agency",requireIdentity,asyncHandler(selectAgency))


module.exports = authRouter