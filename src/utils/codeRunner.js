import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runDocker } from './runDocker.js';
import { submitLogger } from './logger.js';


export const VERDICTS = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
  RUNTIME_ERROR: 'Runtime Error',
  COMPILATION_ERROR: 'Compilation Error',
};

const LANGUAGE_EXT = {
  c: '.c',
  'c++': '.cpp',
  python: '.py',
};

const COMPILE_CMD = {
  c: 'gcc /workspace/main.c -o /workspace/main',
  'c++': 'g++ /workspace/main.cpp -o /workspace/main',
};

const RUN_CMD = {
  c: '/workspace/main',
  'c++': '/workspace/main',
  python: 'python3 /workspace/main.py',
};


async function startContainer(containerName, tempDir) {
  await runDocker([
    'run',
    '--name', containerName,
    '-d',
    '--rm',
    '--user', '0:0',
    '--network', 'none',
    '--memory', '128m',
    '--pids-limit', '64',
    '--cpus', '0.5',
    '--read-only',
    '--tmpfs', '/tmp',
    '--security-opt', 'no-new-privileges',
    '-v', `${tempDir}:/workspace`,
    'judge:1.0',
    'sleep', 'infinity',
  ]);
}

async function stopContainer(containerName) {
  try {
    await runDocker(['stop', containerName]);
  } catch (err) {
    submitLogger.warn(`Failed to stop container ${containerName}: ${err.message}`);
  }
}


async function compileInContainer(containerName, language) {
  if (language === 'python') return { verdict: null, output: '' };

  const cmd = COMPILE_CMD[language];
  const { code, output } = await runDocker([
    'exec', containerName, 'bash', '-c', cmd,
  ]);

  if (code !== 0) {
    submitLogger.warn(`Compilation Error:\n${output}`);
    return { verdict: VERDICTS.COMPILATION_ERROR, output };
  }

  return { verdict: null, output };
}


async function runTestCase(containerName, language, testCase, index, onOutput) {
  const cmd = RUN_CMD[language];

  try {
    const start = Date.now();
    const { code: runExit, output: rawOutput } = await runDocker(
      ['exec', '-i', containerName, 'bash', '-c', cmd],
      testCase.input
    );
    const executionTime = Date.now() - start;

    const output = rawOutput.trim();

    if (runExit !== 0) {
      submitLogger.warn(`Test ${index + 1} Runtime Error: ${output}`);
      const result = {
        testCase: index + 1,
        input: testCase.input,
        expected: testCase.output,
        output,
        passed: false,
        verdict: VERDICTS.RUNTIME_ERROR,
        executionTime,
      };
      if (onOutput) onOutput(`Test case ${index + 1}: RUNTIME ERROR`);
      return result;
    }

    const passed = output === testCase.output.trim();
    const verdict = passed ? VERDICTS.ACCEPTED : VERDICTS.WRONG_ANSWER;

    if (onOutput) onOutput(`Test case ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);

    return {
      testCase: index + 1,
      input: testCase.input,
      expected: testCase.output,
      output,
      passed,
      verdict,
      executionTime,
    };
  } catch (err) {
    if (onOutput) onOutput(`Test case ${index + 1}: ERROR`);
    return {
      testCase: index + 1,
      input: testCase.input,
      expected: testCase.output,
      output: err.message,
      passed: false,
      verdict: VERDICTS.RUNTIME_ERROR,
      executionTime: 0,
    };
  }
}

async function runUserCode(code, language = 'c', testCases = [], onOutput) {
  const ext = LANGUAGE_EXT[language];
  if (!ext) throw new Error(`Unsupported language: ${language}`);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'judge-'));
  const containerName = `judge-${Date.now()}`;

  try {
    // Write source file
    const sourcePath = path.join(tempDir, `main${ext}`);
    await fs.writeFile(sourcePath, code, { mode: 0o644 });

    // Start sandboxed container
    await startContainer(containerName, tempDir);

    // Compile (if applicable)
    const { verdict: compileVerdict, output: compileOutput } =
      await compileInContainer(containerName, language);

    if (compileVerdict) {
      return {
        verdict: compileVerdict,
        compileOutput,
        results: [],
      };
    }

    const results = [];
    for (const [index, testCase] of testCases.entries()) {
      const result = await runTestCase(
        containerName,
        language,
        testCase,
        index,
        onOutput
      );
      results.push(result);
    }

    const failing = results.find((r) => !r.passed);
    const verdict = failing ? failing.verdict : VERDICTS.ACCEPTED;

    return { verdict, results };
  } finally {
    await stopContainer(containerName);
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

export { runUserCode };
