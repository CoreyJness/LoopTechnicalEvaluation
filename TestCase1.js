// testCase1.js
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

  // --- Step 3 & 4: Find the task card by its h3 text ---
  // DOM: <h3 class="font-medium text-gray-900 mb-2">Implement user authentication</h3>
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

  // --- Step 5: Confirm tags using exact Tailwind classes from the DOM ---
  // <span class="... bg-blue-100 text-blue-800">Feature</span>
  // <span class="... bg-orange-100 text-orange-800">High Priority</span>
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