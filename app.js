const express = require("express");
const { getAllCategories } = require("./controller/categories.controller");
const { getApi } = require("./controller/api.controller");
const { deleteCommentsById } = require("./controller/comments.controller");
const {
  getAllReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewsId,
  postCommentByReviewsId,
} = require("./controller/reviews.controller");
const { getAllUsers } = require("./controller/users.controller");
const {
  handlePSQLError,
  handleCustomError,
  handleAll404Error,
  handleServerError,
} = require("./controller/errors.controller");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewsId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewsId);

app.delete("/api/comments/:comment_id", deleteCommentsById);

app.get("/api/users", getAllUsers);

app.all("/*", handleAll404Error);

app.use(handlePSQLError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;
