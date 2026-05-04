// testCase4.js
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

  // --- Step 3: Verify "Push notification system" is in the "To Do" column ---
  // DOM: Column header <h2>To Do</h2> wraps a set of task cards beneath it
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

  // --- Step 4: Confirm tag "Feature" ---
  // DOM: <span class="... bg-blue-100 text-blue-800">Feature</span>
  console.log('Checking tags...');
  const featureTag = taskCard.locator('span.bg-blue-100', { hasText: 'Feature' });

  const hasFeature = await featureTag.isVisible();
  if (hasFeature) {
    console.log('✅ Tag "Feature" confirmed');
  } else {
    console.error('❌ Tag "Feature" NOT found');
  }

  // --- Summary ---
  const allPassed = isTaskVisible && hasFeature;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');

  await page.waitForTimeout(3000);
  await browser.close();
})();