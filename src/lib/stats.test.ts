import type { CategoryKey } from '../state/types';
import { categorizedTotal, computeVoteStats } from './stats';

const msg = (text: string, cat?: CategoryKey) => ({ text, cat });

describe('computeVoteStats', () => {
  it('counts the total and ignores blank thoughts', () => {
    const s = computeVoteStats([msg('Команда'), msg('  '), msg('Гранти')]);
    expect(s.total).toBe(2);
  });

  it('merges near-duplicates (case/punctuation) into similar-vote themes', () => {
    const s = computeVoteStats([
      msg('Сильна команда'),
      msg('сильна команда!'),
      msg('Сильна  команда.'),
      msg('Гранти'),
    ]);
    expect(s.unique).toBe(2); // "сильна команда" (×3) + "гранти" (×1)
    expect(s.themes).toHaveLength(1); // only the repeated theme qualifies
    expect(s.themes[0].count).toBe(3);
    expect(s.themes[0].text).toBe('Сильна команда'); // most frequent original wording
  });

  it('tallies sorted thoughts per category and the theme category', () => {
    const s = computeVoteStats([
      msg('Обладнання', 'wek'),
      msg('обладнання', 'wek'),
      msg('Команда', 'str'),
      msg('Невідсортована'),
    ]);
    expect(s.byCategory).toEqual({ str: 1, wek: 2, opp: 0, thr: 0 });
    expect(categorizedTotal(s)).toBe(3);
    expect(s.themes[0]).toMatchObject({ count: 2, cat: 'wek' });
  });

  it('sorts themes by vote count, most first, capped at six', () => {
    const messages = [
      ...Array(2).fill(msg('a')),
      ...Array(5).fill(msg('b')),
      ...Array(3).fill(msg('c')),
    ];
    const s = computeVoteStats(messages);
    expect(s.themes.map((t) => t.count)).toEqual([5, 3, 2]);
  });

  it('omits a theme’s cat when no merged thought was sorted (no undefined for Firebase)', () => {
    const s = computeVoteStats([msg('Гранти'), msg('гранти')]);
    expect(s.themes).toHaveLength(1);
    expect('cat' in s.themes[0]).toBe(false);
    expect(Object.values(s.themes[0])).not.toContain(undefined);
  });

  it('returns empty stats for no input', () => {
    const s = computeVoteStats([]);
    expect(s).toEqual({ total: 0, unique: 0, byCategory: { str: 0, wek: 0, opp: 0, thr: 0 }, themes: [] });
  });
});
