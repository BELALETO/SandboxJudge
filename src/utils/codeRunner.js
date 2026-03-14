import { spawn } from 'child_process';

/**
 * Compile the user code inside a container
 */
async function compileCode(code) {
  return new Promise((resolve, reject) => {
    const dockerArgs = [
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
      '-i',
      'judge:1.0',
      'bash',
      '-c',
      `
        mkdir -p /tmp/code && \
        cat > /tmp/code/main.c && \
        gcc /tmp/code/main.c -o /tmp/code/main
      `
    ];

    const docker = spawn('docker', dockerArgs);
    let output = '';

    docker.stdin.write(code);
    docker.stdin.end();

    docker.stdout.on('data', (chunk) => (output += chunk.toString()));
    docker.stderr.on('data', (chunk) => (output += chunk.toString()));

    docker.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Compilation failed:\n${output}`));
    });

    docker.on('error', (err) => reject(err));
  });
}

/**
 * Run the compiled program for a single test case
 */
async function runTestCase(input) {
  return new Promise((resolve, reject) => {
    const dockerArgs = [
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
      '-i',
      'judge:1.0',
      'bash',
      '-c',
      `
        cat > /tmp/code/input.txt && \
        /tmp/code/main < /tmp/code/input.txt
      `
    ];

    const docker = spawn('docker', dockerArgs);
    let output = '';

    docker.stdin.write(input);
    docker.stdin.end();

    docker.stdout.on('data', (chunk) => (output += chunk.toString()));
    docker.stderr.on('data', (chunk) => (output += chunk.toString()));

    docker.on('close', (code) => {
      if (code === 0) resolve(output.trim());
      else
        reject(new Error(`Execution failed with exit code ${code}\n${output}`));
    });

    docker.on('error', (err) => reject(err));
  });
}

/**
 * Orchestrates compilation + running all test cases
 */
async function runUserCode(code, testCases = [], onOutput) {
  await compileCode(code);

  const results = [];
  for (const [index, testCase] of testCases.entries()) {
    try {
      const output = await runTestCase(testCase.input);
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
}

export { runUserCode, compileCode, runTestCase };
