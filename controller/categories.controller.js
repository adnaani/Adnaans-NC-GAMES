const { selectAllCategories } = require("../model/categories.model");

exports.getAllCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
