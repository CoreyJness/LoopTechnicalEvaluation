// testLogin.js - Verifies login works independently
const { chromium } = require('playwright');
const { login } = require('./login');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await login(page);
    console.log('');
    console.log('✅ Login test passed!');
  } catch (err) {
    console.error('❌ Login test failed:', err.message);
    process.exit(1);
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();