const categoriesRouter = require("express").Router();
const { getAllCategories } = require("../controller/categories.controller");

categoriesRouter.get("/", getAllCategories);

module.exports = categoriesRouter;
