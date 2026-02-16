export default (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error'
  });
};
