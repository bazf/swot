import { expect, test } from '@playwright/test';

test('the theme toggle persists across a reload', async ({ page }) => {
  await page.goto('/swot/');
  const root = page.locator('.app-root');
  await expect(root).not.toHaveClass(/theme-light/);

  await page.getByRole('button', { name: 'Перемкнути тему' }).click();
  await expect(root).toHaveClass(/theme-light/);

  await page.reload();
  await expect(page.locator('.app-root')).toHaveClass(/theme-light/);
});
