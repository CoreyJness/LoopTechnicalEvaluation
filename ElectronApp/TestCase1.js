// testCase1.js
const { chromium } = require('playwright');
const { login } = require('./login');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await login(page);

  // --- Step 1: Navigate to "Web Application" ---
  console.log('Navigating to Web Application...');
  await page.locator('nav button').filter({ hasText: 'Web Application' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✅ Clicked "Web Application" nav button');

  // --- Step 2 & 3: Find the task card ---
  console.log('Locating task card...');
  const taskCard = page.locator('div.bg-white').filter({
    has: page.locator('h3', { hasText: 'Implement user authentication' })
  });

  const isTaskVisible = await taskCard.isVisible();
  if (isTaskVisible) {
    console.log('✅ "Implement user authentication" card found');
  } else {
    console.error('❌ "Implement user authentication" card NOT found');
  }

  // --- Step 4: Confirm tags ---
  const featureTag = taskCard.locator('span.bg-blue-100', { hasText: 'Feature' });
  const highPriorityTag = taskCard.locator('span.bg-orange-100', { hasText: 'High Priority' });

  const hasFeature = await featureTag.isVisible();
  const hasHighPriority = await highPriorityTag.isVisible();

  if (hasFeature) {
    console.log('✅ Tag "Feature" confirmed');
  } else {
    console.error('❌ Tag "Feature" NOT found');
  }

  if (hasHighPriority) {
    console.log('✅ Tag "High Priority" confirmed');
  } else {
    console.error('❌ Tag "High Priority" NOT found');
  }

  // --- Summary ---
  const allPassed = isTaskVisible && hasFeature && hasHighPriority;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');
  if (!allPassed) process.exit(1);

  await page.waitForTimeout(2000);
  await browser.close();
})();