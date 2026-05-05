// testCase4.js
const { chromium } = require('playwright');
const { login } = require('./login');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await login(page);

  console.log('Navigating to Mobile Application...');
  await page.locator('nav button').filter({ hasText: 'Mobile Application' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✅ Clicked "Mobile Application" nav button');

  console.log('Locating "To Do" column...');
  const toDoColumn = page.locator('div').filter({
    has: page.locator('h2', { hasText: 'To Do' })
  }).first();

  const taskCard = toDoColumn.locator('div.bg-white').filter({
    has: page.locator('h3', { hasText: 'Push notification system' })
  });

  const isTaskVisible = await taskCard.isVisible();
  if (isTaskVisible) {
    console.log('✅ "Push notification system" card found in "To Do" column');
  } else {
    console.error('❌ "Push notification system" card NOT found in "To Do" column');
  }

  const featureTag = taskCard.locator('span.bg-blue-100', { hasText: 'Feature' });
  const hasFeature = await featureTag.isVisible();
  if (hasFeature) {
    console.log('✅ Tag "Feature" confirmed');
  } else {
    console.error('❌ Tag "Feature" NOT found');
  }

  const allPassed = isTaskVisible && hasFeature;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');
  if (!allPassed) process.exit(1);

  await page.waitForTimeout(2000);
  await browser.close();
})();