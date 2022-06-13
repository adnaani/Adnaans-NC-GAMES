const express = require("express");
const apiRouter = require("./routes/api-router");
const categoriesRouter = require("./routes/categories-router");
const usersRouter = require("./routes/users-router");
const commentsRouter = require("./routes/comments-router");
const reviewsRouter = require("./routes/reviews-router");
const {
  handlePSQLError,
  handleCustomError,
  handleAll404Error,
  handleServerError,
} = require("./controller/errors.controller");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

app.all("/*", handleAll404Error);

app.use(handlePSQLError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;
