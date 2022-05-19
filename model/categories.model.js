const db = require("../db/connection");

exports.selectAllCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories`);
  return rows;
};
