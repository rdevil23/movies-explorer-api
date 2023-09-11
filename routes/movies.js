const router = require('express').Router();
const { validateMovieId, validateCreateMovie } = require('../middlewares/validate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
