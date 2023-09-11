require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK, CREATED, BadRequestError, NotFoundError, ConflictError,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return res.status(OK).send(user);
    })
    .catch(next);
};

const editUserData = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(`Переданы некорректные данные при обновлении профиля: ${err.name}`),
        );
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => {
          res.status(CREATED).send({
            _id: user._id,
            email: user.email,
            name: user.name,
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует.'));
          } else if (err.name === 'ValidationError' || err.name === 'CastError') {
            next(
              new BadRequestError(
                `Переданы некорректные данные при создании пользователя: ${err.name}`,
              ),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  editUserData,
  createUser,
  login,
};
