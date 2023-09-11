const Movie = require('../models/movie');
const {
  OK, CREATED, NotFoundError, BadRequestError, ForbiddenError,
} = require('../errors/errors');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(OK).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    description,
    year,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    description,
    year,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((data) => res.status(CREATED).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорретные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм с указанным id не найден.'));
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Попытка удалить фильм другого пользователя.'));
      }
      return Movie.deleteOne(movie).then(() => {
        res.status(OK).send({ message: 'Фильм успешно удален.' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные.'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
