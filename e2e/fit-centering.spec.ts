import { expect, test } from '@playwright/test';

// Regression: the FitStage scene must stay horizontally centered even when the
// viewport is narrower than the 1280px scene — i.e. on smaller desktops and on
// lower-resolution multi-board displays. The grid-based centering used to let
// the (unscaled) 1280px track overflow to the right, pushing the scaled board
// off-centre and clipping its right edge.
test.use({ viewport: { width: 1076, height: 667 } });

test('the board scene stays centered when the viewport is narrower than the scene', async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error test stub
    window.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [] };
    // @ts-expect-error test stub
    window.SpeechSynthesisUtterance = function (t: string) {
      this.text = t;
    };
  });
  await page.goto('/swot/?demo=1');
  await page.getByTitle('Накопичення').click(); // collecting phase → full board UI

  const canvas = page.locator('.board-canvas');
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  const vw = page.viewportSize()!.width;
  if (!box) throw new Error('board canvas not measurable');

  const leftGap = box.x;
  const rightGap = vw - (box.x + box.width);

  // Symmetric gaps ⇒ horizontally centered (allow a couple of px for rounding).
  expect(Math.abs(leftGap - rightGap)).toBeLessThan(4);
  // And nothing is clipped off the right (or left) edge.
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(vw + 1);
});
