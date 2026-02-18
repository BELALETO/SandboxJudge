import config from '../config/config.js';
import AppError from '../utils/AppError.js';

const env = config.env;

const duplicateFieldErrorHandler = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const castErrorHandler = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  console.error(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

export default (err, req, res, next) => {
  let error = err;

  if (error.code === 11000) {
    error = duplicateFieldErrorHandler(error);
  }

  if (error.kind === 'ObjectId') {
    error = castErrorHandler(error);
  }
  if (env === 'development') {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};
