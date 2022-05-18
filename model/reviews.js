const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: `review with id: ${review_id} does not exist`,
        });
      }
      return rows[0];
    });
};

exports.updateReviewById = (review_id, { inc_votes } = 0) => {
  return db
    .query(
      `UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *`,
      [inc_votes, review_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: `review with id: ${review_id} does not exist`,
        });
      }
      return rows[0];
    });
};

exports.selectAllReviews = async () => {
  const reviewsQueryStr = `
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at`;

  const { rows } = await db.query(reviewsQueryStr);

  return rows;
};
