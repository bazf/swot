import { expect, test } from '@playwright/test';

test('moderator colorizes stardust by dragging it into a zone', async ({ page }) => {
  await page.goto('/swot/?demo=1');
  await page.getByTitle('Накопичення').click(); // 8 neutral stardust thoughts
  await expect(page.locator('.asteroid').first()).toBeVisible();
  await page.waitForTimeout(300);

  const borders = () =>
    page.locator('.asteroid').evaluateAll((els) => els.map((e) => getComputedStyle(e).borderTopColor).sort());
  const before = await borders();

  const box = await page.locator('.asteroid').first().boundingBox();
  if (!box) throw new Error('no asteroid');
  const sx = box.x + box.width / 2;
  const sy = box.y + box.height / 2;

  // Drag deliberately toward the top-left corner («Сильні сторони» zone).
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx - 80, sy - 60, { steps: 6 });
  await page.mouse.move(140, 160, { steps: 12 });
  await page.waitForTimeout(60);
  await page.mouse.up();
  await page.waitForTimeout(450); // let the colour transition settle

  const after = await borders();
  // At least one stardust asteroid has gained a category colour.
  expect(after.join('|')).not.toBe(before.join('|'));
});

test('the board background music can be muted', async ({ page }) => {
  await page.goto('/swot/?demo=1');
  const mute = page.getByRole('button', { name: 'Музика' });
  await expect(mute).toBeVisible();
  await expect(mute).toHaveAttribute('aria-pressed', 'false');
  await mute.click();
  await expect(mute).toHaveAttribute('aria-pressed', 'true');
});
