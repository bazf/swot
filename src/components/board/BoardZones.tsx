/* BoardZones — 4 faint corner regions the moderator sorts thoughts into. */

import type { CSSProperties } from 'react';
import { CATS } from '../../data/catalog';
import { CategoryOrb } from '../cosmos';
import { ZONES } from './zones';

export function BoardZones() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {ZONES.map(({ cat, corner }) => {
        const c = CATS[cat];
        const left = corner === 'tl' || corner === 'bl';
        const top = corner === 'tl' || corner === 'tr';
        const region = {
          position: 'absolute',
          width: '50%',
          height: '50%',
          [left ? 'left' : 'right']: 0,
          [top ? 'top' : 'bottom']: 0,
          background: `radial-gradient(80% 80% at ${left ? '0%' : '100%'} ${top ? '0%' : '100%'}, rgba(${c.glow},.12), transparent 70%)`,
        } as CSSProperties;
        const label = {
          position: 'absolute',
          [top ? 'top' : 'bottom']: 70,
          [left ? 'left' : 'right']: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          flexDirection: left ? 'row' : 'row-reverse',
        } as CSSProperties;
        return (
          <div key={cat} style={region}>
            <div style={label}>
              <CategoryOrb cat={cat} size={28} fontSize={14} boxShadow={`0 0 12px rgba(${c.glow},.6)`} />
              <div style={{ textAlign: left ? 'left' : 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12.5, color: `var(--${c.cssVar})` }}>
                  {c.swot}
                </div>
                <div style={{ fontSize: 9.5, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  зона «{c.planet}»
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* faint dividing cross */}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--hairline)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--hairline)' }} />
    </div>
  );
}
