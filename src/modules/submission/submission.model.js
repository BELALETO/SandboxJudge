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
        values: ['C', 'C++', 'Java', 'Python', 'JavaScript'],
        message: "{VALUE} isn't supported."
      }
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
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

export const Submission = mongoose.model('Submission', submissionSchema);
