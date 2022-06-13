const commentsRouter = require("express").Router();

const { deleteCommentsById } = require("../controller/comments.controller");

commentsRouter.delete("/:comment_id", deleteCommentsById);

module.exports = commentsRouter;
