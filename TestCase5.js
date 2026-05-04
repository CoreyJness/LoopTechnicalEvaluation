// testCase5.js
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // --- Step 1: Login ---
  console.log('Navigating to app...');
  await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');

  console.log('Filling in credentials...');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password123');

  console.log('Submitting login...');
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await page.waitForURL(/(?!.*login)/, { timeout: 10000 });
  console.log('✅ Login successful');

  // --- Step 2: Navigate to "Mobile Application" ---
  // DOM: <button class="w-full text-left p-4 ..."><h2 class="font-medium">Mobile Application</h2>
  console.log('Navigating to Mobile Application...');
  await page.locator('nav button').filter({ hasText: 'Mobile Application' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✅ Clicked "Mobile Application" nav button');

  // --- Step 3: Verify "Offline mode" is in the "In Progress" column ---
  // DOM: Column header <h2>In Progress</h2> wraps a set of task cards beneath it
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

  // --- Step 4: Confirm tags "Feature" & "High Priority" ---
  // DOM: <span class="... bg-blue-100 text-blue-800">Feature</span>
  // DOM: <span class="... bg-orange-100 text-orange-800">High Priority</span>
  console.log('Checking tags...');
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

  await page.waitForTimeout(3000);
  await browser.close();
})();