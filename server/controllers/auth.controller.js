const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AppError = require('../utils/errors/appError');

const createJWTToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

const createAndSendToken = (user, statusCode, req, res) => {
  const token = createJWTToken(user.id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signUp = async (req, res, next) => {
  let newUser;

  try {
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
  } catch (e) {
    return next(new AppError(e.message, 400));
  }

  createAndSendToken(newUser, 201, req, res);
};

exports.signIn = async (req, res, next) => {
  const { email, password, deviceIdToken } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide an email or password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPasswords(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (deviceIdToken) {
    user.deviceIdToken = deviceIdToken;
    await user.save();
  }

  createAndSendToken(user, 200, req, res);
};

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    return next(new AppError('You are not authorized. Please log in to access', 401));
  }

  let decodedToken;

  try {
    decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (e) {
    return next(new AppError(e.meessage, 401));
  }

  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    return next(new AppError('The user for the given token does not exist', 401));
  }

  // If passed all the checks, grant access to protected routes
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
};