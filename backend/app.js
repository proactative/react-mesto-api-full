require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const routerUsers = require('./routers/users');
const routerCards = require('./routers/cards');
const { NOT_FOUND } = require('./utils/error-constants');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');
const { validateLogin, validateRegister } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');

const app = express();

const { PORT = 3001, PATH_MONGO = 'mongodb://127.0.0.1:27017/mestodbbbb' } = process.env;
mongoose.set('strictQuery', false);
mongoose.connect(PATH_MONGO, {
  useNewUrlParser: true,
});

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);
app.use(auth);
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Такой страницы не существует.' });
});

app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorMiddleware); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT} ...`);
});
