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
  .get(authentication, restrictTo('Admin'), getAllUsers)
  .get(authentication, restrictTo(['Admin', 'Organizer', 'User']), getCurrentUser)

router.route('/:id')
  .get(authentication, restrictTo(['Admin', 'Organizer', 'User']), getUserById)
  .patch(authentication, restrictTo(['Admin', 'Organizer', 'User']), updateUser)
  .delete(authentication, restrictTo(['Admin', 'Organizer', 'User']), deleteUser);


module.exports = router;