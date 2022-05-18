const express = require("express");
const { getAllCategories } = require("./controller/categories");
const {
  getAllReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewsId,
  postCommentByReviewsId,
} = require("./controller/reviews");
const { getAllUsers } = require("./controller/users");
const {
  handlePSQLErrorOne,
  handlePSQLErrorTwo,
  handlePSQLErrorThree,
  handleCustomError,
  handleAll404Error,
  handleServerError,
} = require("./controller/error");
const app = express();
app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewsId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewsId);

app.get("/api/users", getAllUsers);

app.all("/*", handleAll404Error);

app.use(handlePSQLErrorOne);

app.use(handlePSQLErrorTwo);

app.use(handlePSQLErrorThree);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;
