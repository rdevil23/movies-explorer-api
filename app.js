require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const router = require('./routes');
const limiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(router);

app.use(helmet());
app.use(limiter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to db');
  });

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});
