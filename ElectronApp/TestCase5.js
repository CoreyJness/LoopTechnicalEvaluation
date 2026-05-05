// testCase5.js
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

  console.log('Locating "In Progress" column...');
  const inProgressColumn = page.locator('div').filter({
    has: page.locator('h2', { hasText: 'In Progress' })
  }).first();

  const taskCard = inProgressColumn.locator('div.bg-white').filter({
    has: page.locator('h3', { hasText: 'Offline mode' })
  });

  const isTaskVisible = await taskCard.isVisible();
  if (isTaskVisible) {
    console.log('✅ "Offline mode" card found in "In Progress" column');
  } else {
    console.error('❌ "Offline mode" card NOT found in "In Progress" column');
  }

  const featureTag = taskCard.locator('span.bg-blue-100', { hasText: 'Feature' });
  const highPriorityTag = taskCard.locator('span.bg-orange-100', { hasText: 'High Priority' });

  const hasFeature = await featureTag.isVisible();
  const hasHighPriority = await highPriorityTag.isVisible();

  if (hasFeature) console.log('✅ Tag "Feature" confirmed');
  else console.error('❌ Tag "Feature" NOT found');

  if (hasHighPriority) console.log('✅ Tag "High Priority" confirmed');
  else console.error('❌ Tag "High Priority" NOT found');

  const allPassed = isTaskVisible && hasFeature && hasHighPriority;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');
  if (!allPassed) process.exit(1);

  await page.waitForTimeout(2000);
  await browser.close();
})();