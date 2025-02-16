const {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controller/userController');

const { authentication, restrictTo } = require('../controller/authController');

const router = require('express').Router();

router.route('/')
  .get(authentication, restrictTo('0'), getAllUsers)
  .get(authentication, restrictTo('1'), getCurrentUser)

router.route('/:id')
  .get(authentication, restrictTo('1'), getUserById)
  .patch(authentication, restrictTo('1'), updateUser)
  .delete(authentication, restrictTo('1'), deleteUser);


module.exports = router;