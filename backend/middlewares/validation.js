const { celebrate, Joi } = require('celebrate');

const validateLogin = celebrate(
  {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  },
);

const validateRegister = celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
      about: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  },
);

const validateProfileUpdate = celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  },
);

const validateAvatarUpdate = celebrate(
  {
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    }),
  },
);

const validateToken = celebrate(
  {
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  },
);

const validateCardCreate = celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    }),
  },
);

const validateUserId = celebrate(
  {
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  },
);

const validateCardId = celebrate(
  {
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  },
);

module.exports = {
  validateLogin,
  validateRegister,
  validateProfileUpdate,
  validateAvatarUpdate,
  validateToken,
  validateCardCreate,
  validateUserId,
  validateCardId,
};
