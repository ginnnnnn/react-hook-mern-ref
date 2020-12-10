const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    //any request but get will send options first to make sure it will be auth pass
    return next();
  }
  //inset token in headers Authorization
  // it would comes like Authorization:"Bearer xxssdsdww..."
  try {
    //split() could fail
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      const error = new HttpError('Authentication failed', 401);
      return next(error);
    }
    //return a payload ,string or obj whatever we sets
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Authentication failed', 500);
    return next(error);
  }
};
