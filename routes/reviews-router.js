const reviewsRouter = require("express").Router();
const {
  getAllReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewsId,
  postCommentByReviewsId,
} = require("../controller/reviews.controller");

reviewsRouter.get("/", getAllReviews);

reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewsId)
  .post(postCommentByReviewsId);

module.exports = reviewsRouter;
