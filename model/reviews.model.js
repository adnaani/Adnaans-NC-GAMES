const db = require("../db/connection");
const { selectAllCategories } = require("./categories.model");

exports.selectReviewById = async (review_id) => {
  const reviewQueryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`;
  const reviewValue = [review_id];

  const { rows } = await db.query(reviewQueryStr, reviewValue);

  if (!rows.length) {
    return Promise.reject({
      status: 404,
      message: `review with id: ${review_id} does not exist`,
    });
  }
  return rows[0];
};

exports.updateReviewById = async (review_id, { inc_votes } = 0) => {
  const reviewQueryStr = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *`;
  const reviewValue = [inc_votes, review_id];

  const { rows } = await db.query(reviewQueryStr, reviewValue);

  if (!rows.length) {
    return Promise.reject({
      status: 404,
      message: `review with id: ${review_id} does not exist`,
    });
  }
  return rows[0];
};

exports.selectAllReviews = async ({
  sort_by = "created_at",
  order = "DESC",
  category,
}) => {
  const validSortBy = ["created_at", "votes"];
  const validOrderBy = ["DESC", "ASC"];
  const validCategory = [];

  let reviewsQueryStr = `
  SELECT reviews.*, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id`;

  if (
    !validOrderBy.includes(order) ||
    !validSortBy.includes(sort_by) ||
    !isNaN(category)
  ) {
    return Promise.reject({ status: 400, message: "input is not valid" });
  }

  if (category) {
    let checkCategoryQueryStr = `
      SELECT *
      FROM categories
      WHERE slug = $1
      `;
    const checkCategory = [category];

    const { rows } = await db.query(checkCategoryQueryStr, checkCategory);

    if (!rows.length) {
      return Promise.reject({
        status: 404,
        message: `category: ${category} does not exist`,
      });
    } else {
      reviewsQueryStr += ` WHERE reviews.category = $1`;
      validCategory.push(category);
    }
  }

  reviewsQueryStr += ` 
    GROUP BY reviews.review_id
    ORDER BY reviews.${sort_by} ${order}`;

  const { rows } = await db.query(reviewsQueryStr, validCategory);

  return rows;
};

exports.selectCommentsByReviewsId = async (review_id) => {
  let commentQueryStr = `
    SELECT *
    FROM comments
    WHERE review_id = $1`;
  const commentValue = [review_id];

  const { rows } = await db.query(commentQueryStr, commentValue);

  return rows;
};

exports.insertCommentByReviewsId = async ({ author, body }, review_id) => {
  const commentQueryStr = `
    INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    RETURNING author, body`;
  const commentValue = [author, body, review_id];

  const { rows } = await db.query(commentQueryStr, commentValue);

  return rows[0];
};
