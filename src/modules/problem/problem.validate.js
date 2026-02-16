import Joi from 'joi';

export const createProblemSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  tags: Joi.array().items(Joi.string()),
  testCases: Joi.array()
    .items(
      Joi.object({
        input: Joi.string().required(),
        output: Joi.string().required()
      })
    )
    .min(1)
    .required(),
  points: Joi.number().integer().min(10).max(100).required()
});

export const updateProblemSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
  tags: Joi.array().items(Joi.string()),
  testCases: Joi.array().items(
    Joi.object({
      input: Joi.string().required(),
      output: Joi.string().required()
    })
  ),
  points: Joi.number().integer().min(10).max(100)
});
