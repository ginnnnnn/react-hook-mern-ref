const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
  //User.find({}, '-password') or User.find({}, 'email name')
  let users;
  try {
    users = await User.find({}, '-password').exec();
  } catch (err) {
    return next(new HttpError('fetching users failed ,pls try again', 500));
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed ,pls check your data', 422)
    );
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up error,please try again later', 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError('user existed already, please login in', 422);
    return next(error);
  }
  let hashedPassword;
  try {
    //password and salt
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('could not create password hash for user');
    return next(error, 500);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating user failed');
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating user failed');
    return next(error);
  }
  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up error,please try again later', 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError('Couldnt identified the user', 403);
    return next(error);
  }
  //compare password hash

  let isValidPassword = false;
  try {
    //compare password to hashPassword like apple to exjojdi29wdajd0jdqjd
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Signing up error,please try again later', 500);
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError('Couldnt identified the user', 403);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError('logged in  error,please try again later', 500);
    return next(error);
  }
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
