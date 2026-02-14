export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ errors });
  }

  req.body = value;
  next();
};
