const {
  selectAllReviews,
  selectReviewById,
  updateReviewById,
  selectCommentsByReviewsId,
  insertCommentByReviewsId,
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
  const { query } = req;
  // console.log();

  selectAllReviews(query)
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

exports.postCommentByReviewsId = (req, res, next) => {
  const { body } = req;
  const { review_id } = req.params;

  insertCommentByReviewsId(body, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
