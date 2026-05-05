# Playwright Data-Driven Test Suite

A data-driven Playwright test suite for the Demo App. All test scenarios are defined in a single JSON file — adding or modifying a test case requires **no code changes**.

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

## How It Works

`testData.json` defines every scenario:

```json
{
  "credentials": { "username": "admin", "password": "password123" },
  "testCases": [
    {
      "id": "TC001",
      "description": "...",
      "section": "Web Application",
      "expectedColumn": "To Do",
      "taskName": "Implement user authentication",
      "expectedTags": ["Feature", "High Priority"]
    }
  ]
}
```

`tasks.spec.js` loops over every entry and generates a named test automatically:

```js
for (const tc of testCases) {
  test(`[${tc.id}] ${tc.description}`, async ({ page }) => {
    // login → navigate → find column → find card → verify tags
  });
}
```

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

# Run a specific test by name
npx playwright test --grep "TC003"

# Run only login test
npx playwright test tests/login.spec.js
```

## Adding a New Test Case

Simply add an entry to `data/testData.json`:

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

No code changes required.