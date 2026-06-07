import { expect, test } from '@playwright/test';

// Silence the Web Speech narration on the Star Map.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error test stub
    window.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [] };
    // @ts-expect-error test stub
    window.SpeechSynthesisUtterance = function (t: string) {
      this.text = t;
    };
  });
  await page.goto('/swot/?demo=1');
});

test('renders the start screen', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Галактика Зубрянського ліцею/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Почати місію/ }).first()).toBeVisible();
});

test('walks the full mission: critical → clusters → star map', async ({ page }) => {
  // Jump to critical mass (seeds THRESHOLD ideas).
  await page.getByTitle('Критична маса').click();
  await expect(page.getByText('Критична маса!')).toBeVisible();

  // Oksana swipes the core → AI synthesis → planets.
  await page.getByRole('button', { name: /ШІ-синтез/ }).click();
  await expect(page.getByRole('heading', { name: /Думки згруповано в планети/ })).toBeVisible();

  // Finish → the strategic star map with the TOP-3 orbit.
  await page.getByRole('button', { name: /Завершити місію/ }).click();
  await expect(page.getByRole('heading', { name: /Зоряна карта стратегії/ })).toBeVisible();
  await expect(page.getByText('ТОП-3 на наступний рік')).toBeVisible();
});

test('moderator can finalize early from the board', async ({ page }) => {
  await page.getByTitle('Накопичення').click(); // collecting, below the threshold
  await page.getByRole('button', { name: /Завершити зараз/ }).click();
  await expect(page.getByRole('heading', { name: /Зоряна карта стратегії/ })).toBeVisible();
});
