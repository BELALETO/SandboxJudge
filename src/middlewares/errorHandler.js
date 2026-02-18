import env from '../config/config.js';

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
  const error = { ...err };
  if (env === 'development') {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};
