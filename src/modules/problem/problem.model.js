import mongoose from 'mongoose';
import slugify from 'slugify';

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
      lowercase: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true,
      slugify: function () {
        return slugify(this.title, { lower: true });
      }
    },
    description: {
      type: String,
      required: [true, 'Problem description is required']
    },
    difficulty: {
      type: String,
      required: [true, 'Problem difficulty is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: "{VALUE} isn't supported."
      }
    },
    tags: {
      type: [String],
      default: []
    },
    testCases: [
      {
        input: {
          type: String,
          required: [true, 'Test case input is required']
        },
        output: {
          type: String,
          required: [true, 'Test case output is required']
        }
      }
    ],
    points: {
      type: Number,
      required: [true, 'Problem points are required'],
      min: [10, 'Points must be at least 10.'],
      max: [100, 'Points must be at most 100.']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
