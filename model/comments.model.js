const db = require("../db/connection");

exports.removeCommentsById = async (comment_id) => {
  const commentQueryStr = `
      DELETE FROM comments
      WHERE comment_id = $1`;
  const commentValue = [comment_id];

  if (comment_id) {
    const commentQueryStr = `
    SELECT comment_id
    FROM comments
    WHERE comment_id = $1`;
    const commentValue = [comment_id];

    const { rows } = await db.query(commentQueryStr, commentValue);
    console.log(rows);
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        message: `comment id: ${comment_id} does not exist`,
      });
    }
  }

  const { rows } = await db.query(commentQueryStr, commentValue);

  return rows;
};
