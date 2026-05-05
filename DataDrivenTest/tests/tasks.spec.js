// tests/tasks.spec.js
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');
const testData = require('../data/testData.json');

const { credentials, testCases } = testData;

/**
 * For each test case defined in testData.json, this single test block:
 *  1. Logs in
 *  2. Navigates to the correct section (e.g. "Web Application")
 *  3. Finds the task card inside the expected column
 *  4. Verifies every expected tag is present on that card
 *
 * Adding a new test case requires only a new entry in testData.json — no code changes.
 */
for (const tc of testCases) {
  test(`[${tc.id}] ${tc.description}`, async ({ page }) => {

    // ── Step 1: Login ────────────────────────────────────────────
    await login(page, credentials);

    // ── Step 2: Navigate to section ─────────────────────────────
    await page.locator('nav button').filter({ hasText: tc.section }).click();
    await page.waitForLoadState('networkidle');

    // ── Step 3: Find the column, then the task card inside it ────
    const column = page.locator('div').filter({
      has: page.locator('h2', { hasText: tc.expectedColumn }),
    }).first();

    const taskCard = column.locator('div.bg-white').filter({
      has: page.locator('h3', { hasText: tc.taskName }),
    });

    await expect(taskCard).toBeVisible({
      timeout: 8000,
    });

    // ── Step 4: Verify every expected tag is visible ─────────────
    for (const tag of tc.expectedTags) {
      await expect(
        taskCard.locator('span', { hasText: tag })
      ).toBeVisible();
    }
  });
}