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
      unique: true
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
    testCases: {
      type: [
        {
          input: {
            type: String,
            required: true
          },
          output: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    },
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
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;

        if (Array.isArray(ret.testCases)) {
          ret.testCases = ret.testCases.map((tc) => ({
            input: tc.input,
            output: tc.output
          }));
        } else {
          ret.testCases = [];
        }

        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

problemSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  return;
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
