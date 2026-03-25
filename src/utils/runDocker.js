import { spawn } from 'node:child_process';

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

export { runDocker };
