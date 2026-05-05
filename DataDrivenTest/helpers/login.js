// helpers/login.js
const { expect } = require('@playwright/test');

/**
 * Logs into the Demo App using provided credentials.
 * @param {import('@playwright/test').Page} page
 * @param {object} credentials
 * @param {string} credentials.username
 * @param {string} credentials.password
 */
async function login(page, credentials) {
  await page.goto('/');
  await page.getByLabel('Username').fill(credentials.username);
  await page.getByLabel('Password').fill(credentials.password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await page.waitForURL(/(?!.*login)/, { timeout: 10000 });
}

module.exports = { login };