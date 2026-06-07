import { expect, test } from '@playwright/test';

test('thought-asteroids can be dragged around the board', async ({ page }) => {
  await page.goto('/swot/');
  await page.getByTitle('Накопичення').click(); // seeds 8 drifting ideas

  const asteroid = page.locator('.asteroid').first();
  await expect(asteroid).toBeVisible();

  const before = await asteroid.boundingBox();
  if (!before) throw new Error('asteroid not measurable');

  const cx = before.x + before.width / 2;
  const cy = before.y + before.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 140, cy + 70, { steps: 10 });
  await page.mouse.up();

  const after = await asteroid.boundingBox();
  if (!after) throw new Error('asteroid not measurable after drag');
  const moved = Math.abs(after.x - before.x) + Math.abs(after.y - before.y);
  expect(moved).toBeGreaterThan(30);
});
