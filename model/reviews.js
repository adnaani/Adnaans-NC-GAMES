const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
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
    RETURNING*`,
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
