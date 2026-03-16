const connection = require("../database/conn");
const { handleFailedQuery } = require("../utils/database");

function index(req, res) {
  const moviesSQL = "SELECT * FROM `movies`";
  connection.query(moviesSQL, (err, result) => {
    if (err) return handleFailedQuery(err, res);
    res.json({ result });
  });
}

module.exports = { index };
