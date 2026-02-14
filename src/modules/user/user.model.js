import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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
        validator: function (e) {
          return validator.isEmail(e);
        },
        message: (props) => `${props.value} is not a valid email!`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      min: [8, 'Password must be at least 8 charchters.'],
      select: false,
      validate: {
        validator: function (p) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            p
          );
        },
        message: (props) => `${props.value} is not a valid password!`
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
      enum: {
        values: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
        default: 'Bronze',
        message: "{VALUE} isn't supported."
      }
      //TODO: add problem sovled and populate it.
    }
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
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.passwordConfirm = undefined;
  return;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);

export default User;
