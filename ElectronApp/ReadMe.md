# Playwright Test Runner — Electron UI

A desktop application built with Electron and JavaScript that provides a visual interface for running Playwright test cases against the Demo App. Designed to make test execution accessible to both developers and non-technical stakeholders — no terminal required.

This project was built as part of the Loop Technical Evaluation for QA Testing.

---

## What It Does

- Provides a clean UI to run any of the 7 test scripts individually (Login + TC001–TC006)
- Streams live console output directly into the UI as each test runs
- Displays a clear pass/fail result when each test completes
- Launches a real Chromium browser so test execution is fully visible

---

## Project Structure

```
electron-app/
├── index.html        # UI layout and styles
├── main.js           # Electron main process — spawns test scripts, streams output
├── preload.js        # Secure IPC bridge between main and renderer
├── login.js          # Shared login helper used by all test scripts
├── TestLogin.js      # Verifies login independently
├── TestCase1.js      # Web Application — Implement user authentication
├── TestCase2.js      # Web Application — Fix navigation bug
├── TestCase3.js      # Web Application — Design system updates
├── TestCase4.js      # Mobile Application — Push notification system
├── TestCase5.js      # Mobile Application — Offline mode
├── TestCase6.js      # Mobile Application — App icon design
└── package.json
```

---

## How It Works

Each test case is a standalone Playwright script. When a test is triggered from the UI:

1. `main.js` spawns the selected script as a child process using Node's `spawn`
2. `stdout` and `stderr` are streamed back to the UI in real time via Electron's IPC
3. The exit code determines the final pass/fail status displayed in the UI

The `login.js` helper is shared across all test scripts so authentication logic is never duplicated.

---

## Test Cases

| Script | Section | Task | Expected Column | Tags |
|---|---|---|---|---|
| TestLogin.js | — | Login verification | — | — |
| TestCase1.js | Web Application | Implement user authentication | To Do | Feature, High Priority |
| TestCase2.js | Web Application | Fix navigation bug | To Do | Bug |
| TestCase3.js | Web Application | Design system updates | In Progress | Design |
| TestCase4.js | Mobile Application | Push notification system | To Do | Feature |
| TestCase5.js | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| TestCase6.js | Mobile Application | App icon design | Done | Design |

---

## Setup

```bash
npm install
npx playwright install chromium
```

## To Run

```bash
npm start
```

This opens the Electron app. From there, click any test button to run it — no terminal needed.
