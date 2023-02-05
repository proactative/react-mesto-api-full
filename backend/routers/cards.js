const router = require('express').Router();

const {
  getAllCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const {
  validateCardCreate, validateCardId,
} = require('../middlewares/validation');

router.get('/', getAllCards);
router.post('/', validateCardCreate, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, putLike);
router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
