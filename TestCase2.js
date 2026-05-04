// testCase2.js
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

  // --- Step 2: Navigate to "Web Application" ---
  // DOM: <button class="w-full text-left p-4 ..."><h2 class="font-medium">Web Application</h2>
  console.log('Navigating to Web Application...');
  await page.locator('nav button').filter({ hasText: 'Web Application' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✅ Clicked "Web Application" nav button');

  // --- Step 3: Verify "Fix navigation bug" is in the "To Do" column ---
  // DOM: Column header <h2>To Do</h2> wraps a set of task cards beneath it
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

  // --- Step 4: Confirm tag "Bug" ---
  // DOM: <span class="... bg-red-100 text-red-800">Bug</span>
  console.log('Checking tags...');
  const bugTag = taskCard.locator('span', { hasText: 'Bug' });

  const hasBug = await bugTag.isVisible();
  if (hasBug) {
    console.log('✅ Tag "Bug" confirmed');
  } else {
    console.error('❌ Tag "Bug" NOT found');
  }

  // --- Summary ---
  const allPassed = isTaskVisible && hasBug;
  console.log('');
  console.log(allPassed ? '✅ All checks passed!' : '❌ One or more checks failed.');

  await page.waitForTimeout(3000);
  await browser.close();
})();