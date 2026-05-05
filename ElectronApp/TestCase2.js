// testCase2.js
const { chromium } = require('playwright');
const { login } = require('./login');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await login(page);

  // --- Navigate to "Web Application" ---
  console.log('Navigating to Web Application...');
  await page.locator('nav button').filter({ hasText: 'Web Application' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✅ Clicked "Web Application" nav button');

  // --- Verify "Fix navigation bug" is in the "To Do" column ---
  console.log('Locating "To Do" column...');
  const toDoColumn = page.locator('div').filter({
    has: page.locator('h2', { hasText: 'To Do' })
  }).first();

  const taskCard = toDoColumn.locator('div.bg-white').filter({
    has: page.locator('h3', { hasText: 'Fix navigation bug' })
  });

  const isTaskVisible = await taskCard.isVisible();
  if (isTaskVisible) {
    console.log('✅ "Fix navigation bug" card found in "To Do" column');
  } else {
    console.error('❌ "Fix navigation bug" card NOT found in "To Do" column');
  }

  const bugTag = taskCard.locator('span', { hasText: 'Bug' });
  const hasBug = await bugTag.isVisible();
  if (hasBug) {
    console.log('✅ Tag "Bug" confirmed');
  } else {
    console.error('❌ Tag "Bug" NOT found');
  }

  const allPassed = isTaskVisible && hasBug;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');
  if (!allPassed) process.exit(1);

  await page.waitForTimeout(2000);
  await browser.close();
})();