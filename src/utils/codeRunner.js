import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * Helper to run docker commands
 */
function runDocker(args, stdinData = null) {
  return new Promise((resolve, reject) => {
    const docker = spawn('docker', args);

    let output = '';

    if (stdinData) {
      docker.stdin.write(stdinData);
      docker.stdin.end();
    }

    docker.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });

    docker.stderr.on('data', (chunk) => {
      output += chunk.toString();
    });

    docker.on('close', (code) => {
      resolve({ code, output });
    });

    docker.on('error', reject);
  });
}

/**
 * Compile the user code (C or C++)
 */
async function compileCode(tempDir, language) {
  let compileCmd;
  if (language === 'c') {
    compileCmd = 'gcc /workspace/main.c -o /workspace/main';
  } else if (language === 'c++') {
    compileCmd = 'g++ /workspace/main.cpp -o /workspace/main';
  } else {
    throw new Error('Unsupported language. Use "c" or "c++".');
  }

  const args = [
    'run',
    '--rm',
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
    'bash',
    '-c',
    compileCmd
  ];

  const { code, output } = await runDocker(args);

  if (code !== 0) {
    throw new Error(`Compilation Error:\n${output}`);
  }
}

/**
 * Run compiled program with a test input
 */
async function runTestCase(tempDir, input) {
  const args = [
    'run',
    '--rm',
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
    '-i',
    '-v',
    `${tempDir}:/workspace`,
    'judge:1.0',
    'bash',
    '-c',
    '/workspace/main'
  ];

  const { code, output } = await runDocker(args, input);

  if (code !== 0) {
    throw new Error(`Runtime Error:\n${output}`);
  }

  return output.trim();
}

/**
 * Main orchestrator
 */
async function runUserCode(code, language = 'c', testCases = [], onOutput) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'judge-'));

  try {
    // Determine file extension
    const ext = language === 'c++' ? '.cpp' : '.c';
    const sourcePath = path.join(tempDir, `main${ext}`);

    // write code file
    await fs.writeFile(sourcePath, code, { mode: 0o644 });

    // compile
    await compileCode(tempDir, language);

    const results = [];

    for (const [index, testCase] of testCases.entries()) {
      try {
        const output = await runTestCase(tempDir, testCase.input);

        const passed = output === testCase.output.trim();

        results.push({
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.output,
          output,
          passed
        });

        if (onOutput) {
          onOutput(`Test case ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
        }
      } catch (err) {
        results.push({
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.output,
          output: err.message,
          passed: false
        });

        if (onOutput) {
          onOutput(`Test case ${index + 1}: ERROR`);
        }
      }
    }

    return results;
  } finally {
    // cleanup temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

export { runUserCode };
