const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!['Admin', 'Organizer', 'User', 'Guest'].includes(body.role)) {
    throw new AppError('Invalid user type', 404)
    
  }

  console.log(body)
  const newUser = await user.create({
    firstName: body.firstName,
    lastName: body.lastName,
    userName: body.userName,
    email: body.email,
    role: body.role,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError('Failed to create new user', 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deleteAt;

  result.token = generateToken({
    id: result.id,
    email: result.email,
    role: result.userRole
  })
  
  return res.status(201).json({
    status: 'success',
    message: 'New user profile created successfully',
    data: result,
  })
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const result = await user.findOne({ where: { email }});

  if (result && result.length !== 0) {
    const isPasswordMatched = await bcrypt.compare(password, result.password);
  
    if (!result || !isPasswordMatched) {
      return next(new AppError('Incorrect email or password', 400));
    }

    const token = generateToken({
      id: result.id,
      email: result.email,
      role: result.userRole
    });

    return res.json({
      status: 'success',
      message: 'User Login Successful',
      token,
      firstName: result.firstName,
      role: result.role
    });
  };

  // return res.json({
  //   status: 'fail',
  //   message: 'Incorrect email or password'
  // });

  return next(new AppError('Incorrect email or password', 400));
});


const authentication = catchAsync(async (req, res, next) => {
      //  get the token from headers
      let idToken = "";

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        idToken = req.headers.authorization.split(' ')[1];
      }

      if (!idToken) {
        return next(new AppError('Please Login to get access', 401))
      }
      
      // token verification
      const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
      // Get the user detail from db and add to req object
      const freshUser = await user.findByPk(tokenDetail.id);

      if (!freshUser) {
        return next(new AppError('User does not exist', 400));
      }
      req.user = freshUser;
      return next();
});

// const restrictTo = (...userType) => {
//   const checkPermission = (req, res, next) => {
//     if (!userType.includes(req.user.userTypes)) {
//       return next( new AppError("You do not have permission to perform this action", 403));
//     }
//     return next();
//   };
//   return checkPermission;
// }

const restrictTo = (roles) => {
  const checkPermission = (req, res, next) => {
    if (typeof roles === "string") {
      roles = [roles]
    }
    console.log(roles)
    if (!roles.includes(req.user.role)) {
      return next( new AppError("You do not have permission to perform this action", 403));
    }
    return next();
  };
  return checkPermission;
};

module.exports = {
  signup,
  login,
  authentication,
  restrictTo
};