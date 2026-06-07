/* Asteroid — a teacher's thought as a drifting chip.
   Neutral "stardust" until a category is assigned (moderator zone / AI). */

import type { CSSProperties } from 'react';
import { CATS } from '../../data/catalog';
import type { CategoryKey } from '../../state/types';

const NEUTRAL_GLOW = '190,205,255';

interface AsteroidProps {
  cat?: CategoryKey;
  text: string;
  style?: CSSProperties;
}

export function Asteroid({ cat, text, style }: AsteroidProps) {
  const c = cat ? CATS[cat] : null;
  const glow = c ? c.glow : NEUTRAL_GLOW;
  const icon = c ? c.emoji : '✦';
  return (
    <div
      className="asteroid"
      style={{
        position: 'absolute',
        maxWidth: 196,
        padding: '9px 13px',
        borderRadius: '14px 14px 14px 4px',
        background: `linear-gradient(165deg, rgba(${glow},${c ? '.20' : '.14'}), var(--chip-base))`,
        border: `1px solid rgba(${glow},${c ? '.55' : '.4'})`,
        boxShadow: `0 0 18px rgba(${glow},${c ? '.35' : '.22'}), inset 0 1px 0 rgba(255,255,255,.08)`,
        backdropFilter: 'blur(4px)',
        color: 'var(--ink)',
        fontSize: 13,
        lineHeight: 1.3,
        fontWeight: 600,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        transition: 'background .35s, border-color .35s, box-shadow .35s',
        ...style,
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0, color: c ? undefined : 'var(--gold-soft)' }}>{icon}</span>
      <span style={{ textWrap: 'pretty' } as CSSProperties}>{text}</span>
    </div>
  );
}
