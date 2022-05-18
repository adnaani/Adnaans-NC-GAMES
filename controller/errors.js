exports.handleAll404Error = (req, res, next) => {
  res.status(404).send({ message: "invalid endpoint" });
};

exports.handlePSQLError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "input is not valid" });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "input is missing" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "input does not exist" });
  } else {
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handleServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "internal server error" });
};
