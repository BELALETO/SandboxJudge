import User from '../user/user.model.js';
import { generateToken } from '../../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm
    });
    const token = await generateToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: 'fail',
        message: 'Incorrect email or password.'
      });
    }
    const token = await generateToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
      message: 'something went wrong :('
    });
  }
};
