/* CatButton — a big selectable SWOT-zone button on the phone. */

import { CATS } from '../../data/catalog';
import type { CategoryKey } from '../../state/types';
import { CategoryOrb } from '../cosmos';

interface CatButtonProps {
  cat: CategoryKey;
  active: boolean;
  onClick: () => void;
}

export function CatButton({ cat, active, onClick }: CatButtonProps) {
  const c = CATS[cat];
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        position: 'relative',
        textAlign: 'left',
        cursor: 'pointer',
        padding: '14px 14px',
        borderRadius: 18,
        minHeight: 92,
        border: '1.5px solid ' + (active ? `rgba(${c.glow},.9)` : 'var(--glass-brd)'),
        background: active ? `linear-gradient(160deg, rgba(${c.glow},.30), rgba(20,26,68,.7))` : 'var(--surface)',
        boxShadow: active ? `0 0 22px rgba(${c.glow},.45), inset 0 1px 0 rgba(255,255,255,.1)` : 'none',
        transition: 'all .25s cubic-bezier(.2,.9,.3,1.3)',
        transform: active ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        color: 'var(--ink)',
      }}
    >
      <CategoryOrb cat={cat} size={40} fontSize={19} boxShadow={`0 0 14px rgba(${c.glow},.55), inset -4px -5px 9px rgba(0,0,0,.4)`} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.1 }}>{c.planet}</span>
      <span style={{ fontSize: 10.5, color: 'var(--ink-mute)', lineHeight: 1.2 }}>{c.swot}</span>
      {active && <span style={{ position: 'absolute', top: 12, right: 12, color: `var(--${c.cssVar})`, fontSize: 15 }}>✓</span>}
    </button>
  );
}
