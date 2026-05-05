// testCase6.js
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

  console.log('Locating "Done" column...');
  const doneColumn = page.locator('div').filter({
    has: page.locator('h2', { hasText: 'Done' })
  }).first();

  const taskCard = doneColumn.locator('div.bg-white').filter({
    has: page.locator('h3', { hasText: 'App icon design' })
  });

  const isTaskVisible = await taskCard.isVisible();
  if (isTaskVisible) {
    console.log('✅ "App icon design" card found in "Done" column');
  } else {
    console.error('❌ "App icon design" card NOT found in "Done" column');
  }

  const designTag = taskCard.locator('span', { hasText: 'Design' });
  const hasDesign = await designTag.isVisible();
  if (hasDesign) {
    console.log('✅ Tag "Design" confirmed');
  } else {
    console.error('❌ Tag "Design" NOT found');
  }

  const allPassed = isTaskVisible && hasDesign;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');
  if (!allPassed) process.exit(1);

  await page.waitForTimeout(2000);
  await browser.close();
})();