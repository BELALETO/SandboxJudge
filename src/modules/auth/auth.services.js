import User from '../user/user.model.js';
import { generateToken } from '../../utils/jwt.js';
import AppError from '../../utils/AppError.js';

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, passwordConfirm } = userData;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm
  });

  const token = await generateToken(user.id);

  const sanitizedUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };

  return { user: sanitizedUser, token };
};

export const loginUser = async (incomingData) => {
  const { email, password } = incomingData;
  const user = await User.findOne({ email }).select('+password');
  if (!email || !user.correctPassword(password, user.password)) {
    throw new AppError('Incorrect email or password', 400);
  }
  const token = await generateToken(user.id);

  const sanitizedUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };

  return { user: sanitizedUser, token };
};
