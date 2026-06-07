/* stats.ts — deterministic vote tally for the finale.

   Teachers' anonymous thoughts are the mission's "votes". At finalization we count
   them locally (independent of the AI): the total, near-duplicate thoughts merged
   into "similar votes", and how the sorted thoughts spread across the SWOT quadrants.
   This always reflects the real session, even when the AI synthesis falls back. */

import { CAT_ORDER } from '../data/catalog';
import type { CategoryKey, VoteStats, VoteTheme } from '../state/types';

/** A thought we can count — only the text and (optional) sorted category matter. */
type Votable = { text: string; cat?: CategoryKey };

/** Fold a thought to a comparison key so wording/case/punctuation variants merge. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[«»"'`’.,;:!?…()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Key with the highest tally (ties → first inserted). */
function topKey<K>(counts: Map<K, number>): K | undefined {
  let best: K | undefined;
  let bestN = -1;
  for (const [k, n] of counts) {
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  }
  return best;
}

interface Group {
  count: number;
  originals: Map<string, number>;
  cats: Map<CategoryKey, number>;
}

/** Count the collected thoughts into proportions + similar-vote themes. */
export function computeVoteStats(messages: ReadonlyArray<Votable>): VoteStats {
  const groups = new Map<string, Group>();
  const byCategory: Record<CategoryKey, number> = { str: 0, wek: 0, opp: 0, thr: 0 };
  let total = 0;

  for (const m of messages) {
    const text = (m.text ?? '').trim();
    if (!text) continue;
    total++;
    if (m.cat && m.cat in byCategory) byCategory[m.cat]++;

    const key = normalize(text) || text.toLowerCase();
    let g = groups.get(key);
    if (!g) {
      g = { count: 0, originals: new Map(), cats: new Map() };
      groups.set(key, g);
    }
    g.count++;
    g.originals.set(text, (g.originals.get(text) ?? 0) + 1);
    if (m.cat) g.cats.set(m.cat, (g.cats.get(m.cat) ?? 0) + 1);
  }

  const themes: VoteTheme[] = [...groups.values()]
    .filter((g) => g.count >= 2) // "similar votes" = a thought several people shared
    .map((g) => {
      // Omit `cat` entirely when none of the merged thoughts were sorted into a zone.
      // A literal `undefined` here would crash the Firebase `set()` of the final report
      // ("value argument contains undefined in property … themes.N.cat").
      const theme: VoteTheme = { text: topKey(g.originals) ?? '', count: g.count };
      const cat = g.cats.size ? topKey(g.cats) : undefined;
      if (cat) theme.cat = cat;
      return theme;
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return { total, unique: groups.size, byCategory, themes };
}

/** Total sorted thoughts (the denominator for category proportions). */
export function categorizedTotal(stats: VoteStats): number {
  return CAT_ORDER.reduce((n, k) => n + stats.byCategory[k], 0);
}
