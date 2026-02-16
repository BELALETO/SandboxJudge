import User from '../user/user.model.js';
import { generateToken } from '../../utils/jwt.js';
import passport from 'passport';

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
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          status: 'error',
          message: info ? info.message : 'Login failed'
        });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          return res.status(400).json({
            status: 'error',
            message: error
          });
        }
        const token = await generateToken(user._id);
        return res.json({
          status: 'success',
          token,
          user
        });
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};
