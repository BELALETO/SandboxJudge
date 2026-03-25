import { Worker } from 'bullmq';
import { connectDB } from '../../config/db.js';
import { submitLogger } from '../../utils/logger.js';
import User from '../../modules/user/user.model.js';
import Problem from '../../modules/problem/problem.model.js';
import { Submission } from '../../modules/submission/submission.model.js';
import config from '../../config/config.js';
import { runUserCode, VERDICTS } from '../../utils/codeRunner.js';

const { redisURL } = config;

await connectDB();

const connection = { url: redisURL };

async function processSubmission(job) {
  const { submissionId } = job.data;
  submitLogger.info(`Processing submission ${submissionId}...`);

  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error(`Submission ${submissionId} not found`);

  const problem = await Problem.findById(submission.problem);
  if (!problem) throw new Error(`Problem for submission ${submissionId} not found`);

  const { verdict, results } = await runUserCode(
    submission.code,
    submission.language,
    problem.testCases,
    (text) => submitLogger.info(`Submission ${submissionId} → ${text}`)
  );

  submission.status = verdict;
  submission.testResults = results;

  submission.executionTime = results.reduce(
    (sum, t) => sum + (t.executionTime ?? 0),
    0
  );
  submission.memoryUsage = results.length
    ? Math.max(...results.map((t) => t.memoryUsage ?? 0))
    : 0;

  if (verdict === VERDICTS.ACCEPTED) {
    const user = await User.findById(submission.user);
    if (user) {
      await user.addSolvedProblem(problem._id);
      await user.updateScore(problem._id);
      await user.updateRank();
      await user.save({ validateBeforeSave: false });
    }
  }

  await submission.save();

  return {
    submissionId: submission._id,
    status: submission.status,
    testResults: results,
  };
}

export const buildWorker = new Worker('buildQueue', processSubmission, {
  connection,
});

buildWorker.on('completed', (job, result) => {
  submitLogger.info(
    `Job ${job.id} completed | Submission ${result.submissionId} → ${result.status}`
  );
});

buildWorker.on('failed', (job, error) => {
  submitLogger.error(`Job ${job?.id} failed: ${error.message}`);
});
