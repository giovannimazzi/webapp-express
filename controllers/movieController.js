const connection = require("../database/conn");
const {
  handleFailedQuery,
  handleResourceNotFound,
} = require("../utils/database");

function index(req, res) {
  const moviesSQL = `
    SELECT 
        movies.*,
        AVG(reviews.vote) avg_vote
    FROM movies.movies
    INNER JOIN movies.reviews
    ON movies.id = reviews.movie_id
    GROUP BY movies.id`;
  connection.query(moviesSQL, (err, movieResult) => {
    if (err) return handleFailedQuery(err, res);
    const movies = movieResult.map((movie) => ({
      ...movie,
      avg_vote: parseInt(movie.avg_vote),
      image: buildMovieImgPath(movie.image),
    }));
    res.json({ result: movies });
  });
}

function show(req, res) {
  const { id } = req.params;
  const moviesSQL = `
    SELECT 
        movies.*,
        AVG(reviews.vote) avg_vote
    FROM movies.movies
    INNER JOIN movies.reviews
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?
    GROUP BY movies.id`;
  connection.query(moviesSQL, [id], (err, movieResult) => {
    if (err) return handleFailedQuery(err, res);
    const movie = movieResult[0];
    if (!movie) return handleResourceNotFound(res);

    const reviewSQL = `SELECT * FROM movies.reviews WHERE movie_id = ?`;
    connection.query(reviewSQL, [id], (err, reviewResult) => {
      if (err) return handleFailedQuery(err, res);
      movie.reviews = reviewResult;
      movie.avg_vote = parseInt(movie.avg_vote);
      movie.image = buildMovieImgPath(movie.image);

      res.json({ result: movie });
    });
  });
}

function store(req, res) {
  res.json({ message: "WIP" });
}

function update(req, res) {
  res.json({ message: "WIP" });
}

function modify(req, res) {
  res.json({ message: "WIP" });
}

function destroy(req, res) {
  res.json({ message: "WIP" });
}

module.exports = { index, show, store, update, modify, destroy };

function buildMovieImgPath(image) {
  return `${process.env.APP_URL}:${process.env.APP_PORT}/img/movies_cover/${image}`;
}
