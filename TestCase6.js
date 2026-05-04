// testCase6.js
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

  // --- Step 3: Verify "App icon design" is in the "Done" column ---
  // DOM: Column header <h2>Done</h2> wraps a set of task cards beneath it
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

  // --- Step 4: Confirm tag "Design" ---
  // DOM: <span class="... bg-purple-100 text-purple-800">Design</span>
  console.log('Checking tags...');
  const designTag = taskCard.locator('span', { hasText: 'Design' });

  const hasDesign = await designTag.isVisible();
  if (hasDesign) {
    console.log('✅ Tag "Design" confirmed');
  } else {
    console.error('❌ Tag "Design" NOT found');
  }

  // --- Summary ---
  const allPassed = isTaskVisible && hasDesign;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');

  await page.waitForTimeout(3000);
  await browser.close();
})();