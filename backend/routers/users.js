const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateProfileUpdate,
  validateAvatarUpdate,
  validateUserId,
  validateToken,
} = require('../middlewares/validation');

router.get('/', getAllUsers);
router.get('/me', validateToken, getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateProfileUpdate, updateUser);
router.patch('/me/avatar', validateAvatarUpdate, updateUser);

module.exports = router;
