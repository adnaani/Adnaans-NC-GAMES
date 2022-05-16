const reviews = require("../db/data/test-data/reviews");
const {
  selectAllCategories,
  selectReviewById,
} = require("../models/categories");

exports.getAllCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const {
    params: { review_id },
  } = req;
  selectReviewById(review_id)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
