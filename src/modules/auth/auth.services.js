import User from '../user/user.model.js';
import { generateToken } from '../../utils/jwt.js';
import { sendEmail } from '../../utils/email.js';
import AppError from '../../utils/AppError.js';

export const registerUser = async (userData) => {
  const user = await User.create(userData);

  const token = await generateToken(user.id);

  const sanitizedUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    fullName: user.fullName
  };

  return { user: sanitizedUser, token };
};

export const loginUser = async (incomingData) => {
  const { email, password } = incomingData;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }
  const token = await generateToken(user.id);

  const sanitizedUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    fullName: user.fullName
  };

  return { user: sanitizedUser, token };
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('No user found with that email', 404);
  }
  //TODO: Create password reset token and send email
  const resetToken = await user.generateResetToken();
  user.save({ validateBeforeSave: false });
  //TODO: Send resetToken to user's email
  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
    html: `<p>You requested a password reset. Use the following token to reset your password:</p><p><strong>${resetToken}</strong></p>`
  });
  // return { resetToken };
};
