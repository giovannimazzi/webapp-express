const connection = require("../database/conn");
const {
  handleFailedQuery,
  handleResourceNotFound,
} = require("../utils/database");

function index(req, res) {
  const moviesSQL = `
    SELECT 
        movies.id,
        movies.title,
        movies.director,
        movies.abstract,
        movies.image,
        AVG(reviews.vote) average_vote
    FROM movies.movies
    INNER JOIN movies.reviews
    ON movies.id = reviews.movie_id
    GROUP BY movies.id`;
  connection.query(moviesSQL, (err, movieResult) => {
    if (err) return handleFailedQuery(err, res);
    const movies = movieResult.map((movie) => ({
      ...movie,
      average_vote: parseFloat(movie.average_vote),
      image: buildMovieImgPath(movie.image),
    }));
    res.json({ result: movies });
  });
}

function show(req, res) {
  const { id } = req.params;
  const moviesSQL = `
    SELECT movies.*   
    FROM movies.movies
    WHERE movies.id = ?`;
  connection.query(moviesSQL, [id], (err, movieResult) => {
    if (err) return handleFailedQuery(err, res);
    const movie = movieResult[0];
    if (!movie) return handleResourceNotFound(res);

    const reviewSQL = `
      SELECT * 
      FROM movies.reviews 
      WHERE movie_id = ? 
      ORDER BY created_at DESC`;
    connection.query(reviewSQL, [id], (err, reviewResult) => {
      if (err) return handleFailedQuery(err, res);
      movie.reviews = reviewResult;
      movie.image = buildMovieImgPath(movie.image);

      res.json({ result: movie });
    });
  });
}

function store(req, res) {
  res.json({ message: "WIP" });
}

function storeReview(req, res) {
  const { id } = req.params;
  const { name, vote, text } = req.body;

  const storeReviewSQL = `
  INSERT INTO movies.reviews 
  (movie_id, name, vote, text) VALUES 
  (?, ?, ?, ?);`;

  connection.query(storeReviewSQL, [id, name, vote, text], (err, result) => {
    const showReviewSQL = `SELECT * FROM movies.reviews WHERE id = ?`;
    connection.query(showReviewSQL, [result.insertId], (err, result) => {
      const review = result[0];
      res.json(review);
    });
  });
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

module.exports = { index, show, store, storeReview, update, modify, destroy };

function buildMovieImgPath(image) {
  return `${process.env.APP_URL}:${process.env.APP_PORT}/img/movies_cover/${image}`;
}
