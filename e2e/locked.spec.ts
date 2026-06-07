import { expect, test } from '@playwright/test';

// With a real ciphertext committed, the bare root must require a URL key.
test('the root is gated (access screen) without a key', async ({ page }) => {
  await page.goto('/swot/');
  await expect(page.getByRole('heading', { name: 'Доступ закрито' })).toBeVisible();
});
