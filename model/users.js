const db = require("../db/connection");

exports.selectAllUsers = () => {
  const {rows}= await db.query(`SELECT * FROM users`)
  return rows;

};
