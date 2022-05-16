const { selectReviewById } = require("../model/reviews");

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
