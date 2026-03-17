import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/** Helper to run docker commands */
function runDocker(args, stdinData = null) {
  return new Promise((resolve, reject) => {
    const docker = spawn('docker', args);
    let output = '';

    if (stdinData) {
      docker.stdin.write(stdinData);
      docker.stdin.end();
    }

    docker.stdout.on('data', (chunk) => (output += chunk.toString()));
    docker.stderr.on('data', (chunk) => (output += chunk.toString()));

    docker.on('close', (code) => resolve({ code, output }));
    docker.on('error', reject);
  });
}

/** Main orchestrator: single container for compile + run */
async function runUserCode(code, language = 'c', testCases = [], onOutput) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'judge-'));
  const containerName = `judge-${Date.now()}`;

  try {
    const ext = language === 'c++' ? '.cpp' : '.c';
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
    const compileCmd =
      language === 'c'
        ? 'gcc /workspace/main.c -o /workspace/main'
        : 'g++ /workspace/main.cpp -o /workspace/main';

    const { code: compileExit, output: compileOutput } = await runDocker([
      'exec',
      containerName,
      'bash',
      '-c',
      compileCmd
    ]);

    if (compileExit !== 0) {
      throw new Error(`Compilation Error:\n${compileOutput}`);
    }

    const results = [];

    for (const [index, testCase] of testCases.entries()) {
      try {
        const { code: runExit, output: runOutput } = await runDocker(
          ['exec', '-i', containerName, 'bash', '-c', '/workspace/main'],
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
