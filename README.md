# Sandbox Judge

A robust backend service for executing, scoring, and judging user-submitted code snippets safely within isolated Docker environments. This project powers a competitive programming or algorithmic sandbox, similar to LeetCode or HackerRank.

## Architecture & Features

Sandbox Judge takes raw code submissions (C, C++, Python), securely compiles and runs them against predefined test cases, and returns a verdict (`Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Runtime Error`, `Compilation Error`).

*   **Isolated Code Execution:** User code runs inside highly-restricted Docker containers (`alpine:latest` based), utilizing `tmpfs` mounts, zero network access, unprivileged user modes (`0:0` mapping with `no-new-privileges`), and CPU/Memory constraints to prevent malicious execution (fork bombs, system attacks, resource exhaustion).
*   **Asynchronous Processing:** Code compilation, execution, and judging occur completely asynchronously. Node.js queues the submissions into **BullMQ**. A separate worker process picks up the jobs from the queue to process them in the background.
*   **Stack:** 
    *   **Node.js & Express.js:** The core API server.
    *   **MongoDB:** Data persistence for Users, Problems, and Submissions.
    *   **Redis:** Message broker for BullMQ worker tasks.
    *   **Docker:** Code Sandboxing engine.

## Prerequisites

To run this project, make sure you have the following installed on your system:

1.  [Node.js](https://nodejs.org/) (v16 or higher recommended)
2.  [Docker](https://www.docker.com/) (Required for the code execution sandboxing engine)
3.  [Docker Compose](https://docs.docker.com/compose/) (For easily spinning up MongoDB and Redis)

## Setup & Run Locally

### 1. Build the Code Execution Image

The code runner relies on a locally available Docker image named `judge:1.0` to quickly spawn sandboxes. You must build this image first:

```bash
docker build -t judge:1.0 -f Dockerfile.judge .
```

### 2. Environment Variables

Create a `.env` file in the root directory and ensure the necessary environment variables are set. Standard `.env` might look like:

```ini
PORT=5000
HOST=0.0.0.0
MONGO_URI=mongodb://localhost:27017/SandboxJudge
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your_super_secret_jwt_string
```
*(Check the codebase or existing `.env` structure if you need other specific variables like SMTP configs)*

### 3. Start Database and Message Broker (Redis)

Start up MongoDB and Redis using Docker Compose:

```bash
# This will spin up the `mongodb` and `redis` containers in daemon mode
docker-compose up -d mongodb redis
```

### 4. Install Dependencies

Install the Node.js project dependencies locally:

```bash
npm install
```

### 5. Start the Application

Sandbox Judge consists of two running processes: the **API Server** and the **Build Worker** (which handles BullMQ jobs). 
You can start both simultaneously using `concurrently` (defined in `package.json`):

```bash
npm run start:all
```

Alternatively, you can run them in separate terminal windows for isolated logs:
*   Terminal 1 (Server): `npm run start`
*   Terminal 2 (Worker): `npm run buildWorker`

### 6. Seeding Data (Optional)

If you need initial problems populated in your MongoDB, use the seed script:

```bash
npm run seedProblems
```
*(To remove Seed data, you can use `npm run deleteProblems`)*

## API Endpoints Overview

The `src/modules` structure organizes the application by domain feature:

*   **/auth**: Authentication schemas and routing logic (Login, Signup, JWT).
*   **/problem**: Managing coding challenges and their associated test cases.
*   **/submission**: Posting new code submissions to be added to the build queue, and fetching statuses.
*   **/user**: User profiles and overall standings/stats.

---
*Happy Coding!*
