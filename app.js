const express = require("express");
const { getAllCategories, getReviewById } = require("./controllers/categories");
const app = express();
app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "invalid endpoint" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "id is not valid" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "internal server error" });
});
module.exports = app;
