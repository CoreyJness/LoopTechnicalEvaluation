# Playwright Data-Driven Test Suite

A data-driven Playwright test suite for the Demo App. All test scenarios are defined in a single JSON file — adding or modifying a test case requires no code changes.

This project is part of the Loop Technical Evaluation for QA Testing.

---

## Project Structure

```
playwright-project/
├── data/
│   └── testData.json        # Single source of truth for all test cases
├── helpers/
│   └── login.js             # Reusable login helper
├── tests/
│   ├── login.spec.js        # Login verification test
│   └── tasks.spec.js        # Data-driven task/column/tag tests
├── package.json
└── playwright.config.js
```

---

## How It Works

Every scenario is defined in `testData.json` as a JSON object. `tasks.spec.js` loops over every entry and generates a named test automatically — no code changes required to add new cases.

1. **`testData.json`** — Defines credentials and all test scenarios in one place
2. **`login.js`** — Shared login helper used by both spec files, no duplicated logic
3. **`tasks.spec.js`** — A single `for` loop iterates over every test case and generates a named test dynamically
4. **`playwright.config.js`** — Base URL, screenshots and video captured on failure, HTML report on every run

----

## Test Cases

| ID | Section | Task | Expected Column | Tags |
|---|---|---|---|---|
| TC001 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| TC002 | Web Application | Fix navigation bug | To Do | Bug |
| TC003 | Web Application | Design system updates | In Progress | Design |
| TC004 | Mobile Application | Push notification system | To Do | Feature |
| TC005 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| TC006 | Mobile Application | App icon design | Done | Design |

---

## Setup

```bash
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
npm test

# Run with HTML report
npm run test:report

# Run a specific test by ID
npx playwright test --grep "TC003"

# Run login test only
npx playwright test tests/login.spec.js
```

---

## Adding a New Test Case

Add an entry to `data/testData.json` — no code changes required:

```json
{
  "id": "TC007",
  "description": "My new task is in the correct column",
  "section": "Web Application",
  "expectedColumn": "Done",
  "taskName": "My new task",
  "expectedTags": ["Feature"]
}
```

The suite picks it up automatically on the next run.
