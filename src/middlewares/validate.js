import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    console.error(errors);
    return next(new AppError(`Validation error: ${errors.join(', ')}`, 400));
  }

  req.body = value;
  next();
};
