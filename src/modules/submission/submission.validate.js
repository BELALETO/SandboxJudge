import Joi from 'joi';

export const createSubmissionSchema = Joi.object({
  user: Joi.string().required(),
  problem: Joi.string().required(),
  code: Joi.string().required(),
  language: Joi.string()
    .valid('c', 'c++', 'java', 'python', 'javascript')
    .required()
});

export const updateSubmissionSchema = Joi.object({
  user: Joi.string(),
  problem: Joi.string(),
  code: Joi.string(),
  language: Joi.string().valid('c', 'c++', 'java', 'python', 'javascript')
});
