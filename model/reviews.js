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
