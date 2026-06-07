import { stripUndefined } from './firebase';

describe('stripUndefined', () => {
  it('drops undefined keys so Firebase set() does not reject the payload', () => {
    const cleaned = stripUndefined({ a: 1, b: undefined, c: 'x' });
    expect(cleaned).toEqual({ a: 1, c: 'x' });
    expect('b' in cleaned).toBe(false);
  });

  it('strips undefined inside nested objects and arrays (the themes[].cat case)', () => {
    const report = {
      priorities: ['p1'],
      summary: undefined,
      stats: {
        total: 3,
        themes: [
          { text: 'a', count: 2, cat: 'str' },
          { text: 'b', count: 2, cat: undefined },
        ],
      },
    };
    const cleaned = stripUndefined(report);
    expect(cleaned).toEqual({
      priorities: ['p1'],
      stats: { total: 3, themes: [{ text: 'a', count: 2, cat: 'str' }, { text: 'b', count: 2 }] },
    });
    expect('cat' in cleaned.stats.themes[1]).toBe(false);
  });

  it('leaves primitives, nulls and empty structures intact', () => {
    expect(stripUndefined(null)).toBeNull();
    expect(stripUndefined(0)).toBe(0);
    expect(stripUndefined('')).toBe('');
    expect(stripUndefined([])).toEqual([]);
  });
});
