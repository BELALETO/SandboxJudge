import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submission must belong to a user.']
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Submission must belong to a problem.']
    },
    code: {
      type: String,
      required: [true, 'Code is required.']
    },
    language: {
      type: String,
      required: [true, 'Programming language is required.'],
      enum: {
        values: ['c', 'c++', 'java', 'python', 'javascript'],
        message: "{VALUE} isn't supported."
      }
    },
    status: {
      type: String,
      default: 'Pending',
      enum: {
        values: [
          'Pending',
          'Accepted',
          'Wrong Answer',
          'Time Limit Exceeded',
          'Runtime Error',
          'Compilation Error'
        ],
        message: "{VALUE} isn't supported."
      }
    },
    executionTime: {
      type: Number,
      default: 0
    },
    memoryUsage: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

export const Submission = mongoose.model('Submission', submissionSchema);
