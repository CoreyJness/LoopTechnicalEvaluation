// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');
const testData = require('../data/testData.json');

test('Login - should authenticate with valid credentials', async ({ page }) => {
  await login(page, testData.credentials);

  // Confirm we've left the login page and the app is visible
  await expect(page).not.toHaveURL(/login/);
  await expect(page.locator('nav')).toBeVisible();
});