import { Page } from '@playwright/test';
import { questions } from '../src/lib/questions';

/**
 * Drives through all 16 quiz questions automatically, screenshotting each one.
 * - Single-choice: clicks the first option button
 * - Ranked: clicks each option button up to rankCount, then clicks "Continue"
 *
 * Waits for each question to transition before proceeding.
 */
export async function walkThroughQuiz(page: Page) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const num = String(i + 1).padStart(2, '0');
    const expectedCounter = `${num} / ${questions.length}`;

    // Wait for this question to be visible
    await page.waitForFunction(
      (counter) => document.body.innerText.includes(counter),
      expectedCounter,
      { timeout: 5000 }
    );

    // Screenshot before answering
    await page.screenshot({ path: `test-results/quiz-q${num}.png`, fullPage: true });

    if (q.type === 'ranked') {
      const rankCount = q.rankCount ?? q.options.length;
      for (let r = 0; r < rankCount; r++) {
        await page.getByRole('button', { name: q.options[r].label }).click();
        await page.waitForTimeout(100);
      }
      // Screenshot after all picks are made (ranked list full, before Continue)
      await page.screenshot({ path: `test-results/quiz-q${num}-ranked.png`, fullPage: true });
      await page.getByRole('button', { name: 'Continue' }).waitFor({ timeout: 3000 });
      await page.getByRole('button', { name: 'Continue' }).click();
    } else {
      // Single-choice: click the first option
      await page.getByRole('button', { name: q.options[0].label }).first().click();
    }

    // Wait for transition (220ms exit + 240ms enter)
    await page.waitForTimeout(500);
  }
}
