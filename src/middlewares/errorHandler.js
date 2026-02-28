import config from '../config/config.js';
import AppError from '../utils/AppError.js';
import {
  appLogger,
  authLogger,
  problemLogger,
  submitLogger
} from '../utils/logger.js';

const env = config.env;

/* ----------------------------
   Error normalizers
----------------------------- */
const handleDuplicateFieldError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(
    `Duplicate field value: ${value}. Please use another value!`,
    400
  );
};

const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
};

const normalizeError = (err) => {
  if (err.code === 11000) return handleDuplicateFieldError(err);
  if (err.kind === 'ObjectId') return handleCastError(err);
  return err;
};

/* ----------------------------
   Logging
----------------------------- */
const logError = (err, req) => {
  console.log(req.originalUrl);

  const isAuthRoute = req.originalUrl.includes('/auth');
  const isProblemRoute = req.originalUrl.includes('/problems');
  const isSubmissionRoute = req.originalUrl.includes('/submissions');
  const isOperational = err.isOperational;

  const meta = {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  };

  if (isAuthRoute) {
    if (isOperational) authLogger.warn(err.message, meta);
    else authLogger.error(err.message, { ...meta, stack: err.stack });
    return;
  }

  if (isProblemRoute) {
    if (isOperational) problemLogger.warn(err.message, meta);
    else problemLogger.error(err.message, { ...meta, stack: err.stack });
    return;
  }

  if (isSubmissionRoute) {
    if (isOperational) submitLogger.warn(err.message, meta);
    else submitLogger.error(err.message, { ...meta, stack: err.stack });
    return;
  }

  // Default: application-wide errors
  if (isOperational) appLogger.warn(err.message, meta);
  else appLogger.error(err.message, { ...meta, stack: err.stack });
};

/* ----------------------------
   Response senders
----------------------------- */
const sendDevError = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err
  });
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

/* ----------------------------
   Global error middleware
----------------------------- */
export default (err, req, res, next) => {
  const error = normalizeError(err);

  logError(error, req);

  if (env === 'development') sendDevError(error, res);
  else sendProdError(error, res);
};
