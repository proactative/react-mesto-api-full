const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error'); // 401

const { JWT_SECRET = 'development-key' } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new UnauthorizedError('Токен не прошел проверку'));
  }
  req.user = payload;
  return next();
};
