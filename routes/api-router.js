const apiRouter = require("express").Router();
const { getApi } = require("../controller/api.controller");

apiRouter.get("/", getApi);

module.exports = apiRouter;
