import { test, expect } from '@playwright/test';
import { walkThroughQuiz } from './quiz-helper';

test('landing page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).not.toBeEmpty();
  await page.screenshot({ path: 'test-results/landing.png', fullPage: true });
});

test('quiz walk-through (mocked API)', async ({ page }) => {
  // Mock the POST /api/responses so no DB is needed
  await page.route('/api/responses', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: '00000000-0000-0000-0000-000000000000' }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/quiz');
  await page.waitForSelector('h2');

  await walkThroughQuiz(page);

  // After the last question, the app POSTs and redirects to /results/{id}
  await page.waitForURL('**/results/00000000-0000-0000-0000-000000000000', { timeout: 10000 });
  await page.screenshot({ path: 'test-results/quiz-complete.png', fullPage: true });
});

test('full end-to-end with real DB', async ({ page }) => {
  test.skip(!process.env.FB_PROJECT_ID, 'requires Firebase credentials');

  await page.goto('/quiz');
  await walkThroughQuiz(page);

  // Wait for redirect to real results page
  await page.waitForURL('**/results/**', { timeout: 15000 });
  await expect(page.locator('body')).not.toBeEmpty();
  await page.screenshot({ path: 'test-results/results.png', fullPage: true });
});
