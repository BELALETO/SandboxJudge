import User from '../user/user.model.js';
import { generateToken } from '../../utils/jwt.js';

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, passwordConfirm } = userData;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm
  });

  const token = await generateToken(user._id);

  return { user, token };
};

export const loginUser = async (user) => {
  const token = await generateToken(user._id);
  return { user, token };
};
