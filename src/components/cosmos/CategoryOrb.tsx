/* CategoryOrb — the recurring glowing emoji circle for a SWOT category. */

import type { CSSProperties } from 'react';
import { CATS } from '../../data/catalog';
import type { CategoryKey } from '../../state/types';

interface CategoryOrbProps {
  cat: CategoryKey;
  size: number;
  fontSize?: number;
  boxShadow?: string;
  style?: CSSProperties;
}

export function CategoryOrb({ cat, size, fontSize, boxShadow, style }: CategoryOrbProps) {
  const c = CATS[cat];
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        fontSize: fontSize ?? size * 0.5,
        background: `radial-gradient(circle at 35% 30%, var(--${c.cssVar}), var(--${c.cssVar}-deep))`,
        boxShadow: boxShadow ?? `0 0 16px rgba(${c.glow},.5), inset -4px -5px 9px rgba(0,0,0,.4)`,
        ...style,
      }}
    >
      {c.emoji}
    </span>
  );
}
