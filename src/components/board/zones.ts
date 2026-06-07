/* zones.ts — board → SWOT zone mapping (matches the star-map corners). */

import type { CategoryKey } from '../../state/types';

export const BOARD_W = 1280;
export const BOARD_H = 720;

export type Corner = 'tl' | 'tr' | 'bl' | 'br';

/** Corner ↔ category — the single source of truth shared with the Star Map. */
export const ZONES: { cat: CategoryKey; corner: Corner }[] = [
  { cat: 'str', corner: 'tl' },
  { cat: 'wek', corner: 'tr' },
  { cat: 'opp', corner: 'bl' },
  { cat: 'thr', corner: 'br' },
];

/** Which SWOT zone the top-left point of an asteroid falls into. */
export function zoneForPoint(x: number, y: number, w = BOARD_W, h = BOARD_H): CategoryKey {
  // Approximate the asteroid's centre (max-width 196, ~36 tall).
  const cx = x + 98;
  const cy = y + 18;
  const left = cx < w / 2;
  const top = cy < h / 2;
  if (top) return left ? 'str' : 'wek';
  return left ? 'opp' : 'thr';
}
