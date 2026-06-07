/* SwotCell — one SWOT quadrant block in the printed report. */

import { CATS } from '../../data/catalog';
import type { CategoryKey, StarPlanet } from '../../state/types';

const TONE: Record<CategoryKey, string> = { str: '#B8860B', wek: '#6D3FC4', opp: '#0E8A77', thr: '#C53A28' };
const BG: Record<CategoryKey, string> = { str: '#FFF8E6', wek: '#F3EEFF', opp: '#E6FAF5', thr: '#FFEDE9' };

interface SwotCellProps {
  cat: CategoryKey;
  planets: StarPlanet[];
}

export function SwotCell({ cat, planets }: SwotCellProps) {
  const c = CATS[cat];
  const tone = TONE[cat];
  const bg = BG[cat];
  return (
    <div style={{ border: `1px solid ${tone}33`, borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 12px',
          background: bg,
          borderBottom: `1px solid ${tone}22`,
        }}
      >
        <span style={{ fontSize: 15 }}>{c.emoji}</span>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12.5, color: tone }}>{c.swot}</div>
        <div style={{ marginLeft: 'auto', fontSize: 9.5, color: '#999', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          {c.planet}
        </div>
      </div>
      <ul style={{ margin: 0, padding: '10px 14px 12px 26px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {planets.map((p, i) => (
          <li key={i} style={{ fontSize: 11.5, color: '#2a2f45', lineHeight: 1.35 }}>
            {p.title} <span style={{ color: '#aaa' }}>· {p.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
