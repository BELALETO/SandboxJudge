import User from '../user/user.model.js';

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
    res.status(201).json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
