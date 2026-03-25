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

1.  [Docker](https://www.docker.com/)
2.  [Docker Compose](https://docs.docker.com/compose/)

*(Note: You do not need Node.js installed locally, as the entire application runs inside Docker containers.)*

## Setup & Run

### 1. Environment Variables

Create a `.env` file in the root directory. Because the application runs via Docker Compose, the database and Redis URLs should point to the container names. A standard `.env` might look like:

```ini
PORT=5000
HOST=0.0.0.0
MONGO_URI=mongodb://mongodb:27017/SandboxJudge
REDIS_URL=redis://redis:6379
JWT_SECRET=your_super_secret_jwt_string
```

### 2. Start the Application

Start up everything (MongoDB, Redis, and the Sandbox Judge API/Worker, along with building the Sandbox Judge image) using Docker Compose:

```bash
docker-compose up --build
```
*(Optionally, add `-d` at the end to run in detached daemon mode.)*

This single command will automatically build the backend application image, install its dependencies inside the container, build the safe execution sandboxing image, and spin up all required services.

### 3. Seeding Data (Optional)

If you need initial problems populated in your MongoDB, you can execute the seed script inside the running backend container:

```bash
docker exec -it sandbox-judge npm run seedProblems
```
*(To remove Seed data, you can use `docker exec -it sandbox-judge npm run deleteProblems`)*

## API Endpoints Overview

The `src/modules` structure organizes the application by domain feature:

*   **/auth**: Authentication schemas and routing logic (Login, Signup, JWT).
*   **/problem**: Managing coding challenges and their associated test cases.
*   **/submission**: Posting new code submissions to be added to the build queue, and fetching statuses.
*   **/user**: User profiles and overall standings/stats.

---
*Happy Coding!*
