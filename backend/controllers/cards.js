const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ForbiddenError = require('../errors/forbidden-error');

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner likes')
    .then((data) => res.send(data))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные карточки.'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена.')) // если БД возвращает пустой обьект
    .then((card) => {
      if (String(card.owner) !== userId) {
        throw new ForbiddenError('Удалить карточку может только владелец.');
      }
      // card.delete();
      return card.delete();
    })
    .then(() => {
      res.send({ message: 'Карточка успешно удалена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные карточки.'));
        return;
      }
      next(err);
    });
};

const putLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner likes')
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      throw new NotFoundError('Запрашиваемая карточка не найдена.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные карточки.'));
        return;
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      throw new NotFoundError('Запрашиваемая карточка не найдена.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные карточки.'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, putLike, deleteLike,
};
