const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllUsers = catchAsync(async (req, res, next) => {
  // const userId = req.user.id;
  const currentUser = req.user

  if (currentUser.role !== role.Admin) {
    return next(new AppError('User not authorized to perform this action', 401));
  }
  const result = await user.findAll({
      include: user,
      where: { createdBy: currentUser.id },
  });

  return res.json({
      status: 'success',
      data: result,
  });
});

const getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id
  const result = await user.findByPk(userId);
    if (!result) {
        return next(new AppError('Invalid user id', 400));
    }
    return res.json({
        status: 'success',
        data: result,
    });
});

const getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id
  const result = await user.findByPk(userId);
    if (!result) {
        return next(new AppError('Invalid user id', 400));
    }
    return res.json({
        status: 'success',
        data: result,
    });
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userIdToUpdate = req.params.id;
  
  const user = await user.findByPk({ id: userId })

  if (userId !== userIdToUpdate && user.role !== 'ADMIN') {
    return next(new AppError('User does not have permission to perform this action', 401));
  }

  const result = await user.findOne({
      where: { id: userIdToUpdate },
  });

  if (!result) {
      return next(new AppError('Invalid user id', 400));
  }

  result.title = body.title;
  result.eventImage = body.eventImage;
  result.eventPrice = body.eventPrice;
  result.shortDesc = body.shortDesc;
  result.description = body.description;
  result.category = body.category;

  
  const updatedResult = await result.save();

  return res.json({
      status: 'success',
      data: updatedResult,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userToDelete = req.params.id
  const body = req.body;

  const result = await user.findOne({
    where: { id: userToDelete },
  });

  if (userId !== userIdToUpdate && result.role !== 'ADMIN') {
    return next(new AppError('User does not have permission to perform this action', 401));
  }

  if (!result) {
    return next(new AppError('Invalid user id', 400));
  }

  await result.destroy();

  return res.json({
    status: 'success',
    message: 'Record deleted successfully',
  });
});

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
}