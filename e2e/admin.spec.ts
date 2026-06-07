import { expect, test } from '@playwright/test';

test('the admin tool encrypts config and emits the committable snippet', async ({ page }) => {
  await page.goto('/swot/?admin=1');
  await expect(page.getByText('Адмін · Шифрування конфігурації')).toBeVisible();

  await page.getByLabel('apiKey').fill('AIzaTESTKEY');
  await page.getByLabel(/Пароль шифрування/).fill('hunter2');
  await page.getByRole('button', { name: /Зашифрувати/ }).click();

  await expect(page.getByText(/Зашифровано та перевірено/)).toBeVisible();
  await expect(page.locator('textarea[readonly]')).toContainText('ENCRYPTED_CONFIG');
});
