import { Worker } from 'bullmq';
import { connectDB } from '../../config/db.js';
import { submitLogger } from '../../utils/logger.js';
import User from '../../modules/user/user.model.js';
import Problem from '../../modules/problem/problem.model.js';
import { Submission } from '../../modules/submission/submission.model.js';
import config from '../../config/config.js';
import { runUserCode } from '../../utils/codeRunner.js';
import AppError from '../../utils/AppError.js';

const { redisURL } = config;

await connectDB();

const connection = { url: redisURL };

export const buildWorker = new Worker(
  'buildQueue',
  async (job) => {
    submitLogger.info(`Processing submission ${job.data.submissionId}...`);

    // 1. Fetch submission and problem
    const submission = await Submission.findById(job.data.submissionId);
    const problem = await Problem.findById(submission.problem);

    if (!submission || !problem) {
      throw new AppError('Submission or problem not found', 404);
    }

    // 2. Run the code against all problem test cases
    const testResults = await runUserCode(
      submission.code,
      problem.testCases,
      (text) => {
        submitLogger.info(`Submission ${submission._id} output: ${text}`);
      }
    );

    // 3. Determine if all test cases passed
    const isAccepted = testResults.every((t) => t.passed);

    // 4. Update submission
    submission.status = isAccepted ? 'Accepted' : 'Wrong Answer';
    submission.testResults = testResults;

    // Optionally, calculate total execution time & max memory
    submission.executionTime = testResults.reduce(
      (sum, t) => sum + (t.executionTime || 0),
      0
    );
    submission.memoryUsage = Math.max(
      ...testResults.map((t) => t.memoryUsage || 0)
    );

    // 5. Update user stats if accepted
    if (isAccepted) {
      const user = await User.findById(submission.user);

      await user.addSolvedProblem(problem._id);
      await user.updateScore(problem._id);
      await user.updateRank();
      await user.save({ validateBeforeSave: false });
    }

    await submission.save();

    return {
      submissionId: submission._id,
      status: submission.status,
      testResults
    };
  },
  { connection }
);

// Logging
buildWorker.on('completed', (job, result) => {
  submitLogger.info(
    `Job ${job.id} completed | Submission ${result.submissionId} → ${result.status}`
  );
});

buildWorker.on('failed', (job, error) => {
  submitLogger.error(`Job ${job?.id} failed: ${error.message}`);
});
