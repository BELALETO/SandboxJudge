import passport from 'passport';
import { registerUser, loginUser } from './auth.services.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await registerUser(req.body);

    res.status(201).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const login = (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          status: 'error',
          message: info?.message || 'Login failed'
        });
      }

      try {
        const result = await loginUser(user);

        res.json({
          status: 'success',
          token: result.token,
          user: result.user
        });
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};
