import { expect, test } from '@playwright/test';

// Cluster planets are laid out spaced (no overlap, no central core), so they are a
// deterministic, non-occluded drag target for the scale-aware Draggable.
test('planets can be dragged around the board', async ({ page }) => {
  await page.goto('/swot/?demo=1');
  await page.getByTitle('Кластери').click(); // clusters phase → planet diagrams

  const planet = page.locator('.planet').first();
  await expect(planet).toBeVisible();
  await page.waitForTimeout(300); // let the entrance settle

  const before = await planet.boundingBox();
  if (!before) throw new Error('planet not measurable');
  const sx = before.x + before.width / 2;
  const sy = before.y + before.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 60, sy + 30, { steps: 6 });
  await page.mouse.move(sx + 130, sy + 70, { steps: 10 });
  await page.waitForTimeout(60);
  await page.mouse.up();

  const after = await planet.boundingBox();
  if (!after) throw new Error('planet not measurable after drag');
  const moved = Math.abs(after.x - before.x) + Math.abs(after.y - before.y);
  expect(moved).toBeGreaterThan(20);
});
