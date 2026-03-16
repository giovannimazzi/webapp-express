function handleFailedQuery(err, res) {
  const responseData = {
    message: "Database query failed",
  };

  if (process.env.APP_MODE === "dev") {
    responseData.error = err.message;
  }

  console.log(err.message);
  return res.status(500).json(responseData);
}

module.exports = { handleFailedQuery };
