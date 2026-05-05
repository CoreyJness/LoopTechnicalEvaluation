// testCase3.js
const { chromium } = require('playwright');
const { login } = require('./login');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await login(page);

  console.log('Navigating to Web Application...');
  await page.locator('nav button').filter({ hasText: 'Web Application' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✅ Clicked "Web Application" nav button');

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