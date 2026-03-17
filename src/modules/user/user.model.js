import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import Problem from '../problem/problem.model.js';
import AppError from '../../utils/AppError.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      lowercase: true,
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false,
      validate: {
        validator: function (p) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            p
          );
        },
        message: 'Password is not strong enough.'
      }
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password confirm is required'],
      validate: {
        validator: function (p) {
          return p === this.password;
        },
        message: 'Unmatched passwords.'
      }
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    role: {
      type: String,
      default: 'User',
      enum: {
        values: ['Admin', 'User'],
        message: "{VALUE} isn't supported."
      }
    },
    score: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      default: 'Bronze',
      enum: {
        values: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
        message: "{VALUE} isn't supported."
      }
    },
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.passwordConfirm;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.updateRank = function () {
  if (this.score >= 1000) this.rank = 'Diamond';
  else if (this.score >= 500) this.rank = 'Platinum';
  else if (this.score >= 200) this.rank = 'Gold';
  else if (this.score >= 100) this.rank = 'Silver';
  else this.rank = 'Bronze';
  return this;
};

userSchema.methods.addSolvedProblem = async function (problemId) {
  const alreadySolved = this.solvedProblems.some((id) => id.equals(problemId));
  if (alreadySolved) return this;

  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError('Problem not found', 404);

  this.solvedProblems.push(problemId);
  return this;
};

userSchema.methods.updateScore = async function (problemId) {
  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError('Problem not found', 404);

  this.score += problem.points;
  return this;
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
