import { Worker } from 'bullmq';
import { connectDB } from '../../config/db.js';
import { submitLogger } from '../../utils/logger.js';
import { Submission } from '../../modules/submission/submission.model.js';
import User from '../../modules/user/user.model.js';
import Problem from '../../modules/problem/problem.model.js';
import config from '../../config/config.js';

const { redisURL } = config;

await connectDB();

const connection = { url: redisURL };

export const buildWorker = new Worker(
  'buildQueue',
  async (job) => {
    submitLogger.info(`Processing submission ${job.data.submissionId}`);

    // simulate execution time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const submission = await Submission.findById(job.data.submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    const isAccepted = true; // testing mode

    submission.status = isAccepted ? 'Accepted' : 'Wrong Answer';
    submission.executionTime = Math.floor(Math.random() * 1000);
    submission.memoryUsage = Math.floor(Math.random() * 256);

    if (isAccepted) {
      const user = await User.findById(submission.user);
      const problem = await Problem.findById(submission.problem);

      await user.addSolvedProblem(problem._id);
      await user.updateScore(problem._id);
      user.updateRank();

      await user.save({ validateBeforeSave: false });
    }

    await submission.save();

    return {
      submissionId: submission._id,
      status: submission.status
    };
  },
  { connection }
);

buildWorker.on('completed', (job, result) => {
  submitLogger.info(
    `Job ${job.id} completed | submission ${result.submissionId} → ${result.status}`
  );
});

buildWorker.on('failed', (job, error) => {
  submitLogger.error(`Job ${job?.id} failed: ${error.message}`);
});
