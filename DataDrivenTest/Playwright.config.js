// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'https://animated-gingersnap-8cf7f2.netlify.app/',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});