import { BOARD_H, BOARD_W, zoneForPoint } from './zones';

describe('zoneForPoint', () => {
  it('maps quadrants to SWOT categories (matching the star-map corners)', () => {
    expect(zoneForPoint(40, 40)).toBe('str'); // top-left
    expect(zoneForPoint(BOARD_W - 220, 40)).toBe('wek'); // top-right
    expect(zoneForPoint(40, BOARD_H - 120)).toBe('opp'); // bottom-left
    expect(zoneForPoint(BOARD_W - 220, BOARD_H - 120)).toBe('thr'); // bottom-right
  });
});
