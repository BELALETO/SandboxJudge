import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runDocker } from './runDocker';

/** Main orchestrator: single container for compile + run */
async function runUserCode(code, language = 'c', testCases = [], onOutput) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'judge-'));
  const containerName = `judge-${Date.now()}`;

  try {
    let ext = '.c';
    if (language === 'c++') ext = '.cpp';
    if (language === 'python') ext = '.py';

    const sourcePath = path.join(tempDir, `main${ext}`);
    await fs.writeFile(sourcePath, code, { mode: 0o644 });

    // start container once in detached mode
    await runDocker([
      'run',
      '--name',
      containerName,
      '-d', // detached
      '--rm', // remove container when stopped
      '--user',
      '0:0',
      '--network',
      'none',
      '--memory',
      '128m',
      '--pids-limit',
      '64',
      '--cpus',
      '0.5',
      '--read-only',
      '--tmpfs',
      '/tmp',
      '--security-opt',
      'no-new-privileges',
      '-v',
      `${tempDir}:/workspace`,
      'judge:1.0',
      'sleep',
      'infinity'
    ]);

    // compile inside container
    let compileExit = 0;
    let compileOutput = '';

    if (language !== 'python') {
      const compileCmd =
        language === 'c'
          ? 'gcc /workspace/main.c -o /workspace/main'
          : 'g++ /workspace/main.cpp -o /workspace/main';

      const compileResult = await runDocker([
        'exec',
        containerName,
        'bash',
        '-c',
        compileCmd
      ]);
      compileExit = compileResult.code;
      compileOutput = compileResult.output;
    }

    if (compileExit !== 0) {
      throw new Error(`Compilation Error:\n${compileOutput}`);
    }

    const results = [];

    for (const [index, testCase] of testCases.entries()) {
      try {
        const runCmd =
          language === 'python'
            ? 'python3 /workspace/main.py'
            : '/workspace/main';

        const { code: runExit, output: runOutput } = await runDocker(
          ['exec', '-i', containerName, 'bash', '-c', runCmd],
          testCase.input
        );

        const output = runOutput.trim();

        if (runExit !== 0) {
          throw new Error(output || 'Runtime Error');
        }

        const passed = output === testCase.output.trim();

        results.push({
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.output,
          output,
          passed
        });

        if (onOutput)
          onOutput(`Test case ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
      } catch (err) {
        results.push({
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.output,
          output: err.message,
          passed: false
        });
        if (onOutput) onOutput(`Test case ${index + 1}: ERROR`);
      }
    }

    return results;
  } finally {
    // stop container and cleanup temp directory
    await runDocker(['stop', containerName]);
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

export { runUserCode };
