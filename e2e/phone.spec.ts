import { expect, test } from '@playwright/test';

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
  await page.getByRole('button', { name: /Телефон/ }).click();
});

test('submits an anonymous thought from the phone', async ({ page }) => {
  await page.getByTitle('Накопичення').click();
  await page.getByRole('button', { name: /Зірки/ }).click();
  await page.getByLabel('Ваша думка').fill('Чудова команда вчителів');
  await page.getByRole('button', { name: /Запустити в космос/ }).click();
  await expect(page.getByText('Думку відправлено!')).toBeVisible();
  await expect(page.getByText(/надіслано: 1/)).toBeVisible();
});

test('shows the downloadable report preview at the finale', async ({ page }) => {
  await page.getByTitle('Зоряна карта').click();
  await expect(page.getByRole('heading', { name: 'Місію завершено' })).toBeVisible();
  await page.getByRole('button', { name: /Завантажити SWOT-звіт/ }).click();
  await expect(page.getByText('SWOT-аналіз навчального року · Педагогічна рада')).toBeVisible();
});
