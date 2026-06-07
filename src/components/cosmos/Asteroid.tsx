/* Asteroid — a teacher's thought as a drifting chip. */

import type { CSSProperties } from 'react';
import { CATS } from '../../data/catalog';
import type { CategoryKey } from '../../state/types';

interface AsteroidProps {
  cat: CategoryKey;
  text: string;
  style?: CSSProperties;
}

export function Asteroid({ cat, text, style }: AsteroidProps) {
  const c = CATS[cat];
  return (
    <div
      className="asteroid"
      style={{
        position: 'absolute',
        maxWidth: 196,
        padding: '9px 13px',
        borderRadius: '14px 14px 14px 4px',
        background: `linear-gradient(165deg, rgba(${c.glow},.20), var(--chip-base))`,
        border: `1px solid rgba(${c.glow},.55)`,
        boxShadow: `0 0 18px rgba(${c.glow},.35), inset 0 1px 0 rgba(255,255,255,.08)`,
        backdropFilter: 'blur(4px)',
        color: 'var(--ink)',
        fontSize: 13,
        lineHeight: 1.3,
        fontWeight: 600,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        ...style,
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{c.emoji}</span>
      <span style={{ textWrap: 'pretty' } as CSSProperties}>{text}</span>
    </div>
  );
}
