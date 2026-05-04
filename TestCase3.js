// testCase3.js
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

  // --- Step 3: Verify "Design system updates" is in the "In Progress" column ---
  // DOM: Column header <h2>In Progress</h2> wraps a set of task cards beneath it
  console.log('Locating "In Progress" column...');
  const inProgressColumn = page.locator('div').filter({
    has: page.locator('h2', { hasText: 'In Progress' })
  }).first();

  const taskCard = inProgressColumn.locator('div.bg-white').filter({
    has: page.locator('h3', { hasText: 'Design system updates' })
  });

  const isTaskVisible = await taskCard.isVisible();
  if (isTaskVisible) {
    console.log('✅ "Design system updates" card found in "In Progress" column');
  } else {
    console.error('❌ "Design system updates" card NOT found in "In Progress" column');
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