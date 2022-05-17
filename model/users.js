const db = require("../db/connection");

exports.selectAllUsers = () => {
  return db.query(`SELECT username FROM users`).then(({ rows }) => {
    return rows;
  });
};
