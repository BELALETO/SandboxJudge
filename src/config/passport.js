import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../modules/user/user.model.js';

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.correctPassword(password, user.password))) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

passport.use(localStrategy);

export default passport;
