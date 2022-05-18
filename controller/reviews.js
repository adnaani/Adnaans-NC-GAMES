const {
  selectAllReviews,
  selectReviewById,
  updateReviewById,
  selectCommentsByReviewsId,
} = require("../model/reviews");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;

  updateReviewById(review_id, body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getAllReviews = (req, res, next) => {
  selectAllReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsByReviewsId = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReviewsId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
