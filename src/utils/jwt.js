import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { promisify } from 'node:util';

const { jwtSecret, jwtExpiry } = config;

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

export const verifyToken = async (token) => {
  return await verify(token, jwtSecret);
};

export const generateToken = async (id) => {
  return await sign({ id }, jwtSecret, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry
  });
};
