const express = require("express");
const { getAllCategories } = require("./controllers/categories");
const app = express();
app.use(json.express());

app.get("/api/categories", getAllCategories);

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Invalid endpoint" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal server error" });
});
module.exports = app;
