import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { promisify } from 'node:util';

const { jwtSecret, jwtExpiry } = config;
const sign = promisify(jwt.sign);

export const generateToken = async (id) => {
  return await sign({ id }, jwtSecret, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry
  });
};
