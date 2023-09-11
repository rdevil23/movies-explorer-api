const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { AuthError } = require('../errors/errors');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Введите корректный email',
      },
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      required: [true, 'Поле "name" должно быть заполнено'],
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError('Неправильные почта или пароль');
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
