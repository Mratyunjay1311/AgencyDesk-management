const express = require("express");
const { createComment, listComments } = require("../controllers/commentController");
const asyncHandler = require("../utils/asyncHandler");

const commentRouter = express.Router({ mergeParams: true });

commentRouter.post("/", asyncHandler(createComment));
commentRouter.get("/", asyncHandler(listComments));

module.exports = commentRouter