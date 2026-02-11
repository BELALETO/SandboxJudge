import { port, host, app } from './app.js';

const server = app.listen(port, host, () => {
  console.log(`Running on ${host}:${port}`);
});

server.on('error', (err) => console.error(err));
